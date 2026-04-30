import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const userId = user.userId;
        const role = user.role;

        // RBAC: Admin exports everything, User exports only their own data
        const where = role === "Admin" ? {} : { UserID: userId };

        const expenses = await prisma.expenses.findMany({
            where,
            include: {
                categories: true,
                peoples: true,
                projects: true
            },
            orderBy: { ExpenseDate: 'desc' }
        });

        // CSV Headers
        let csv = "Date,Detail,Category,Project,Person,Amount,Description\n";

        // Rows
        expenses.forEach(e => {
            const date = new Date(e.ExpenseDate).toLocaleDateString();
            const detail = `"${e.ExpenseDetail?.replace(/"/g, '""') || ""}"`;
            const cat = `"${e.categories?.CategoryName || ""}"`;
            const proj = `"${e.projects?.ProjectName || ""}"`;
            const person = `"${e.peoples?.PeopleName || ""}"`;
            const amount = e.Amount;
            const desc = `"${e.Description?.replace(/"/g, '""') || ""}"`;

            csv += `${date},${detail},${cat},${proj},${person},${amount},${desc}\n`;
        });

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="expenses_export.csv"',
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ message: "Failed to export data", error: String(error) }, { status: 500 });
    }
}
