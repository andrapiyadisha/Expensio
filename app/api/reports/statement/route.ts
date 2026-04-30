import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId } = user;

        const [expenses, incomes, projects] = await Promise.all([
            prisma.expenses.findMany({ where: { UserID: userId } }),
            prisma.incomes.findMany({ where: { UserID: userId } }),
            prisma.projects.findMany({ 
                where: { UserID: userId },
                include: {
                    expenses: { select: { Amount: true } },
                    incomes: { select: { Amount: true } }
                }
            })
        ]);

        const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.Amount.toString()), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.Amount.toString()), 0);

        // Monthly breakdown (last 6 months)
        const monthlyData: any = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        [...expenses, ...incomes].forEach(item => {
            const date = new Date((item as any).ExpenseDate || (item as any).IncomeDate);
            const monthLabel = months[date.getMonth()];
            if (!monthlyData[monthLabel]) monthlyData[monthLabel] = { income: 0, expense: 0 };
            
            if ((item as any).ExpenseID) {
                monthlyData[monthLabel].expense += parseFloat((item as any).Amount.toString());
            } else {
                monthlyData[monthLabel].income += parseFloat((item as any).Amount.toString());
            }
        });

        const monthlyBreakdown = Object.keys(monthlyData).map(month => ({
            month,
            ...monthlyData[month]
        }));

        const projectBreakdown = projects.map(p => ({
            name: p.ProjectName,
            income: p.incomes.reduce((sum, i) => sum + parseFloat(i.Amount.toString()), 0),
            expense: p.expenses.reduce((sum, e) => sum + parseFloat(e.Amount.toString()), 0)
        }));

        return NextResponse.json({
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            monthlyBreakdown,
            projectBreakdown
        });

    } catch (error) {
        console.error("Statement API Error:", error);
        return NextResponse.json({ message: "Failed to fetch statement", error: String(error) }, { status: 500 });
    }
}
