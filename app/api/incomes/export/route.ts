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

        const incomes = await prisma.incomes.findMany({
            where,
            include: {
                categories: true,
                peoples: true,
                projects: true
            },
            orderBy: { IncomeDate: 'desc' }
        });

        let csv = "Date,Detail,Category,Project,Person,Amount,Description\n";

        incomes.forEach(i => {
            const date = new Date(i.IncomeDate).toLocaleDateString();
            const detail = `"${i.IncomeDetail?.replace(/"/g, '""') || ""}"`;
            const cat = `"${i.categories?.CategoryName || ""}"`;
            const proj = `"${i.projects?.ProjectName || ""}"`;
            const person = `"${i.peoples?.PeopleName || ""}"`;
            const amount = i.Amount;
            const desc = `"${i.Description?.replace(/"/g, '""') || ""}"`;

            csv += `${date},${detail},${cat},${proj},${person},${amount},${desc}\n`;
        });

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="incomes_export.csv"',
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ message: "Failed to export data", error: String(error) }, { status: 500 });
    }
}
