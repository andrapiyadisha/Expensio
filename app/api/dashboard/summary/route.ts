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

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Totals
        const [totalIncomeSum, totalExpenseSum] = await Promise.all([
            prisma.incomes.aggregate({
                where: role === "Admin" ? {} : { UserID: userId },
                _sum: { Amount: true }
            }),
            prisma.expenses.aggregate({
                where: role === "Admin" ? {} : { UserID: userId },
                _sum: { Amount: true }
            }),
        ]);

        const totalIncome = parseFloat(totalIncomeSum._sum.Amount?.toString() || "0");
        const totalExpense = parseFloat(totalExpenseSum._sum.Amount?.toString() || "0");
        const totalBalance = totalIncome - totalExpense;

        // 2. Month-over-Month Comparisons
        const [thisMonthIncomeSum, thisMonthExpenseSum, lastMonthIncomeSum, lastMonthExpenseSum] = await Promise.all([
            prisma.incomes.aggregate({
                _sum: { Amount: true },
                where: {
                    ...baseWhere,
                    IncomeDate: { gte: firstDayThisMonth }
                }
            }),
            prisma.expenses.aggregate({
                _sum: { Amount: true },
                where: {
                    ...baseWhere,
                    ExpenseDate: { gte: firstDayThisMonth }
                }
            }),
            prisma.incomes.aggregate({
                _sum: { Amount: true },
                where: {
                    ...baseWhere,
                    IncomeDate: { gte: firstDayLastMonth, lte: lastDayLastMonth }
                }
            }),
            prisma.expenses.aggregate({
                _sum: { Amount: true },
                where: {
                    ...baseWhere,
                    ExpenseDate: { gte: firstDayLastMonth, lte: lastDayLastMonth }
                }
            }),
        ]);

        const thisMonthIncome = parseFloat(thisMonthIncomeSum._sum.Amount?.toString() || "0");
        const thisMonthExpense = parseFloat(thisMonthExpenseSum._sum.Amount?.toString() || "0");
        const lastMonthIncome = parseFloat(lastMonthIncomeSum._sum.Amount?.toString() || "0");
        const lastMonthExpense = parseFloat(lastMonthExpenseSum._sum.Amount?.toString() || "0");

        const calculatePercentChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        const incomeChangePercent = calculatePercentChange(thisMonthIncome, lastMonthIncome);
        const expenseChangePercent = calculatePercentChange(thisMonthExpense, lastMonthExpense);

        // 3. Counts
        const [totalPeople, totalProjects] = await Promise.all([
            prisma.peoples.count({ where: { ...baseWhere } }),
            prisma.projects.count({ where: { ...baseWhere } }),
        ]);

        // 4. Recent Transactions
        const [recentExpenses, recentIncomes] = await Promise.all([
            prisma.expenses.findMany({
                where: { ...baseWhere },
                take: 5,
                orderBy: { ExpenseDate: 'desc' },
                include: { categories: true }
            }),
            prisma.incomes.findMany({
                where: { ...baseWhere },
                take: 5,
                orderBy: { IncomeDate: 'desc' },
                include: { categories: true }
            })
        ]);

        const recentTransactions = [
            ...recentExpenses.map(e => ({
                id: `exp-${e.ExpenseID}`,
                title: e.ExpenseDetail || e.categories?.CategoryName || "Expense",
                amount: parseFloat(e.Amount.toString()),
                type: 'expense',
                date: e.ExpenseDate,
                category: e.categories?.CategoryName
            })),
            ...recentIncomes.map(i => ({
                id: `inc-${i.IncomeID}`,
                title: i.IncomeDetail || i.categories?.CategoryName || "Income",
                amount: parseFloat(i.Amount.toString()),
                type: 'income',
                date: i.IncomeDate,
                category: i.categories?.CategoryName
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        // 5. Monthly Trend (Aggregated) - Last 6 months
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const [rawExpenses, rawIncomes] = await Promise.all([
            prisma.expenses.findMany({
                where: {
                    ...baseWhere,
                    ExpenseDate: { gte: sixMonthsAgo }
                },
                select: { ExpenseDate: true, Amount: true }
            }),
            prisma.incomes.findMany({
                where: {
                    ...baseWhere,
                    IncomeDate: { gte: sixMonthsAgo }
                },
                select: { IncomeDate: true, Amount: true }
            })
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData: Record<string, { income: number, expense: number }> = {};

        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            monthlyData[label] = { income: 0, expense: 0 };
        }

        rawExpenses.forEach(e => {
            const d = new Date(e.ExpenseDate);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            if (monthlyData[label]) monthlyData[label].expense += parseFloat(e.Amount.toString());
        });

        rawIncomes.forEach(i => {
            const d = new Date(i.IncomeDate);
            const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
            if (monthlyData[label]) monthlyData[label].income += parseFloat(i.Amount.toString());
        });

        // 6. Category-wise Expense
        const expenseByCat = await prisma.expenses.groupBy({
            where: { ...baseWhere },
            by: ['CategoryID'],
            _sum: { Amount: true },
        });

        const categoryEntities = await prisma.categories.findMany({
            where: {
                CategoryID: { in: expenseByCat.map(c => c.CategoryID).filter(id => id !== null) as number[] }
            }
        });

        const categoryWiseExpense = expenseByCat.map(item => {
            const cat = categoryEntities.find(c => c.CategoryID === item.CategoryID);
            return {
                category: cat?.CategoryName || "Unknown",
                total: parseFloat(item._sum.Amount?.toString() || "0")
            };
        }).sort((a, b) => b.total - a.total);

        const topSpendingCategory = categoryWiseExpense[0]?.category || "None";

        return NextResponse.json({
            totalIncome,
            totalExpense,
            totalBalance,
            thisMonthIncome,
            thisMonthExpense,
            lastMonthIncome,
            lastMonthExpense,
            incomeChangePercent,
            expenseChangePercent,
            totalPeople,
            totalProjects,
            recentTransactions,
            monthlyExpenseData: Object.values(monthlyData).map(v => v.expense).reverse(),
            monthlyIncomeData: Object.values(monthlyData).map(v => v.income).reverse(),
            monthlyLabels: Object.keys(monthlyData).reverse(),
            categoryWiseExpense,
            topSpendingCategory
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
