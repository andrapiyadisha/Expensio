import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId } = user;

        const [expenses, incomes] = await Promise.all([
            prisma.expenses.findMany({
                where: { UserID: userId },
                include: {
                    categories: true,
                    peoples: true,
                    projects: true,
                    sub_categories: true
                },
                orderBy: { ExpenseDate: "desc" }
            }),
            prisma.incomes.findMany({
                where: { UserID: userId },
                include: {
                    categories: true,
                    peoples: true,
                    projects: true,
                    sub_categories: true
                },
                orderBy: { IncomeDate: "desc" }
            })
        ]);

        // Transform data for Excel
        const expenseData = expenses.map(e => ({
            "Date": e.ExpenseDate.toISOString().split('T')[0],
            "Category": e.categories?.CategoryName || "N/A",
            "Sub-Category": e.sub_categories?.SubCategoryName || "N/A",
            "Paid To/By": e.peoples?.PeopleName || "N/A",
            "Project": e.projects?.ProjectName || "N/A",
            "Amount (INR)": parseFloat(e.Amount.toString()),
            "Detail": e.ExpenseDetail || "",
            "Description": e.Description || ""
        }));

        const incomeData = incomes.map(i => ({
            "Date": i.IncomeDate.toISOString().split('T')[0],
            "Category": i.categories?.CategoryName || "N/A",
            "Sub-Category": i.sub_categories?.SubCategoryName || "N/A",
            "Received From": i.peoples?.PeopleName || "N/A",
            "Project": i.projects?.ProjectName || "N/A",
            "Amount (INR)": parseFloat(i.Amount.toString()),
            "Detail": i.IncomeDetail || "",
            "Description": i.Description || ""
        }));

        // Create workbook
        const wb = XLSX.utils.book_new();
        
        const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(wb, wsExpenses, "Expenses");

        const wsIncomes = XLSX.utils.json_to_sheet(incomeData);
        XLSX.utils.book_append_sheet(wb, wsIncomes, "Incomes");

        // Generate buffer
        const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        return new NextResponse(buf, {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="Financial_Report.xlsx"',
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });

    } catch (error) {
        console.error("Excel Export Error:", error);
        return NextResponse.json({ message: "Failed to export Excel", error: String(error) }, { status: 500 });
    }
}
