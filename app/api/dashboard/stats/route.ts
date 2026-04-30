import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { userId, role } = user;

        // RBAC: Admin sees everything, User sees only their own data
        const baseWhere = role === "Admin" ? {} : { UserID: userId };

        // Fetch totals
        const totalExpenses = await prisma.expenses.aggregate({
            _sum: { Amount: true },
            where: { ...baseWhere }
        });

        const totalIncomes = await prisma.incomes.aggregate({
            _sum: { Amount: true },
            where: { ...baseWhere }
        });

        const peopleCount = await prisma.peoples.count({ where: { ...baseWhere } });
        const projectCount = await prisma.projects.count({ where: { ...baseWhere } });

        // Fetch recent transactions (latest 5 expenses and 5 incomes)
        const recentExpenses = await prisma.expenses.findMany({
            where: { ...baseWhere },
            take: 5,
            orderBy: { ExpenseDate: 'desc' },
            include: { categories: true }
        });

        const recentIncomes = await prisma.incomes.findMany({
            where: { ...baseWhere },
            take: 5,
            orderBy: { IncomeDate: 'desc' },
            include: { categories: true }
        });

        // Combine and sort recent transactions
        const recentTransactions = [
            ...recentExpenses.map((e: any) => ({
                id: `exp-${e.ExpenseID}`,
                title: e.ExpenseDetail || e.categories?.CategoryName || "Expense",
                amount: `-₹${parseFloat(e.Amount.toString()).toLocaleString()}`,
                type: 'expense',
                date: e.ExpenseDate,
                category: e.categories?.CategoryName
            })),
            ...recentIncomes.map((i: any) => ({
                id: `inc-${i.IncomeID}`,
                title: i.IncomeDetail || i.categories?.CategoryName || "Income",
                amount: `+₹${parseFloat(i.Amount.toString()).toLocaleString()}`,
                type: 'income',
                date: i.IncomeDate,
                category: i.categories?.CategoryName
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        // Monthly data for charts (last 6 months)
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const expensesByMonth = await prisma.expenses.groupBy({
            by: ['ExpenseDate'],
            where: {
                ...baseWhere,
                ExpenseDate: { gte: sixMonthsAgo }
            },
            _sum: { Amount: true }
        });

        const incomesByMonth = await prisma.incomes.groupBy({
            by: ['IncomeDate'],
            where: {
                ...baseWhere,
                IncomeDate: { gte: sixMonthsAgo }
            },
            _sum: { Amount: true }
        });

        // Process grouping by month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData: Record<string, { expense: number, income: number }> = {};

        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            chartData[label] = { expense: 0, income: 0 };
        }

        expensesByMonth.forEach(item => {
            const d = new Date(item.ExpenseDate);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            if (chartData[label]) {
                chartData[label].expense += parseFloat(item._sum.Amount?.toString() || "0");
            }
        });

        incomesByMonth.forEach(item => {
            const d = new Date(item.IncomeDate);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            if (chartData[label]) {
                chartData[label].income += parseFloat(item._sum.Amount?.toString() || "0");
            }
        });

        const categoriesSpendings = await prisma.expenses.groupBy({
            where: { ...baseWhere },
            by: ['CategoryID'],
            _sum: { Amount: true },
            orderBy: { _sum: { Amount: 'desc' } },
            take: 5
        });

        // Fetch category names for spendings
        const categoryIds = categoriesSpendings.map(c => c.CategoryID).filter(id => id !== null) as number[];
        const categoryNames = await prisma.categories.findMany({
            where: { CategoryID: { in: categoryIds } }
        });

        const spendingsData = categoriesSpendings.map(c => {
            const cat = categoryNames.find(cn => cn.CategoryID === c.CategoryID);
            return {
                label: cat?.CategoryName || "Other",
                value: parseFloat(c._sum.Amount?.toString() || "0")
            };
        });

        return NextResponse.json({
            totalExpenses: parseFloat(totalExpenses._sum.Amount?.toString() || "0"),
            totalIncome: parseFloat(totalIncomes._sum.Amount?.toString() || "0"),
            peopleCount,
            projectCount,
            recentTransactions,
            chartLabels: Object.keys(chartData).reverse(),
            chartExpenses: Object.values(chartData).map(v => v.expense).reverse(),
            chartIncomes: Object.values(chartData).map(v => v.income).reverse(),
            spendingsData
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard stats", error: String(error) },
            { status: 500 }
        );
    }
}
