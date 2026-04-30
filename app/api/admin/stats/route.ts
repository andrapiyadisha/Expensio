import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (user.role !== "Admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Admin sees ALL data — no UserID filter
        const [
            totalIncomeAgg,
            totalExpenseAgg,
            thisMonthIncomeAgg,
            thisMonthExpenseAgg,
            lastMonthIncomeAgg,
            lastMonthExpenseAgg,
        ] = await Promise.all([
            prisma.incomes.aggregate({ _sum: { Amount: true } }),
            prisma.expenses.aggregate({ _sum: { Amount: true } }),
            prisma.incomes.aggregate({ _sum: { Amount: true }, where: { IncomeDate: { gte: firstDayThisMonth } } }),
            prisma.expenses.aggregate({ _sum: { Amount: true }, where: { ExpenseDate: { gte: firstDayThisMonth } } }),
            prisma.incomes.aggregate({ _sum: { Amount: true }, where: { IncomeDate: { gte: firstDayLastMonth, lte: lastDayLastMonth } } }),
            prisma.expenses.aggregate({ _sum: { Amount: true }, where: { ExpenseDate: { gte: firstDayLastMonth, lte: lastDayLastMonth } } }),
        ]);

        const totalIncome = parseFloat(totalIncomeAgg._sum.Amount?.toString() || "0");
        const totalExpense = parseFloat(totalExpenseAgg._sum.Amount?.toString() || "0");
        const thisMonthIncome = parseFloat(thisMonthIncomeAgg._sum.Amount?.toString() || "0");
        const thisMonthExpense = parseFloat(thisMonthExpenseAgg._sum.Amount?.toString() || "0");
        const lastMonthIncome = parseFloat(lastMonthIncomeAgg._sum.Amount?.toString() || "0");
        const lastMonthExpense = parseFloat(lastMonthExpenseAgg._sum.Amount?.toString() || "0");

        const calcChange = (current: number, prev: number) =>
            prev === 0 ? (current > 0 ? 100 : 0) : ((current - prev) / prev) * 100;

        const incomeChangePercent = calcChange(thisMonthIncome, lastMonthIncome);
        const expenseChangePercent = calcChange(thisMonthExpense, lastMonthExpense);

        // Top spending category (all expenses, no user filter)
        const expenseByCat = await prisma.expenses.groupBy({
            by: ["CategoryID"],
            _sum: { Amount: true },
            orderBy: { _sum: { Amount: "desc" } },
        });

        // Top income category (all incomes, no user filter)
        const incomeByCat = await prisma.incomes.groupBy({
            by: ["CategoryID"],
            _sum: { Amount: true },
            orderBy: { _sum: { Amount: "desc" } },
        });

        const topExpenseCatId = expenseByCat[0]?.CategoryID;
        const topIncomeCatId = incomeByCat[0]?.CategoryID;

        const [topExpenseCat, topIncomeCat] = await Promise.all([
            topExpenseCatId
                ? prisma.categories.findUnique({ where: { CategoryID: topExpenseCatId } })
                : Promise.resolve(null),
            topIncomeCatId
                ? prisma.categories.findUnique({ where: { CategoryID: topIncomeCatId } })
                : Promise.resolve(null),
        ]);

        const topSpendingCategory = topExpenseCat?.CategoryName || "None";
        const topIncomeCategory = topIncomeCat?.CategoryName || "None";

        return NextResponse.json({
            totalIncome,
            totalExpense,
            totalBalance: totalIncome - totalExpense,
            thisMonthIncome,
            thisMonthExpense,
            lastMonthIncome,
            lastMonthExpense,
            incomeChangePercent,
            expenseChangePercent,
            topSpendingCategory,
            topIncomeCategory,
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
