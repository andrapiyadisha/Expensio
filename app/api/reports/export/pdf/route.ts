import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, name } = user;

        const [expenses, incomes] = await Promise.all([
            prisma.expenses.findMany({
                where: { UserID: userId },
                include: { categories: true, peoples: true },
                orderBy: { ExpenseDate: "desc" }
            }),
            prisma.incomes.findMany({
                where: { UserID: userId },
                include: { categories: true, peoples: true },
                orderBy: { IncomeDate: "desc" }
            })
        ]);

        const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.Amount.toString()), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.Amount.toString()), 0);
        const netBalance = totalIncome - totalExpense;

        const formatINR = (amt: number) => `INR ${amt.toLocaleString('en-IN')}`;

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        // HEADER
        page.drawText("Wealth Report", { x: 50, y: height - 50, size: 24, font: boldFont, color: rgb(0.23, 0.51, 0.96) });
        page.drawText(`Generated for: ${name}`, { x: width - 200, y: height - 40, size: 10, font, color: rgb(0.39, 0.45, 0.55) });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: width - 200, y: height - 55, size: 10, font, color: rgb(0.39, 0.45, 0.55) });

        // SUMMARY SECTION
        page.drawRectangle({
            x: 50,
            y: height - 160,
            width: 500,
            height: 80,
            color: rgb(0.97, 0.98, 0.99),
            borderColor: rgb(0.89, 0.91, 0.94),
            borderWidth: 1
        });

        page.drawText("Financial Summary", { x: 70, y: height - 110, size: 14, font: boldFont, color: rgb(0.12, 0.16, 0.23) });
        
        page.drawText("Total Income:", { x: 70, y: height - 130, size: 10, font, color: rgb(0.39, 0.45, 0.55) });
        page.drawText(formatINR(totalIncome), { x: 180, y: height - 130, size: 10, font: boldFont, color: rgb(0.06, 0.73, 0.51) });

        page.drawText("Total Expenses:", { x: 70, y: height - 145, size: 10, font, color: rgb(0.39, 0.45, 0.55) });
        page.drawText(formatINR(totalExpense), { x: 180, y: height - 145, size: 10, font: boldFont, color: rgb(0.94, 0.27, 0.27) });

        page.drawText("Net Balance:", { x: 300, y: height - 130, size: 10, font, color: rgb(0.39, 0.45, 0.55) });
        page.drawText(formatINR(netBalance), { x: 400, y: height - 130, size: 12, font: boldFont, color: rgb(0.23, 0.51, 0.96) });

        // TRANSACTIONS TABLE
        page.drawText("Recent Transactions", { x: 50, y: height - 200, size: 14, font: boldFont, color: rgb(0.12, 0.16, 0.23) });

        const tableTop = height - 220;
        page.drawLine({ start: { x: 50, y: tableTop }, end: { x: 550, y: tableTop }, thickness: 1, color: rgb(0.89, 0.91, 0.94) });

        // Table Header
        const headerY = tableTop - 15;
        page.drawText("Date", { x: 50, y: headerY, size: 10, font: boldFont, color: rgb(0.58, 0.64, 0.72) });
        page.drawText("Description", { x: 120, y: headerY, size: 10, font: boldFont, color: rgb(0.58, 0.64, 0.72) });
        page.drawText("Category", { x: 320, y: headerY, size: 10, font: boldFont, color: rgb(0.58, 0.64, 0.72) });
        page.drawText("Type", { x: 420, y: headerY, size: 10, font: boldFont, color: rgb(0.58, 0.64, 0.72) });
        page.drawText("Amount", { x: 550, y: headerY, size: 10, font: boldFont, color: rgb(0.58, 0.64, 0.72) });

        let currentY = headerY - 20;

        const allTransactions = [
            ...expenses.map(e => ({ date: e.ExpenseDate, detail: e.ExpenseDetail || "Expense", cat: e.categories?.CategoryName || "N/A", type: "Exp", amt: parseFloat(e.Amount.toString()) })),
            ...incomes.map(i => ({ date: i.IncomeDate, detail: i.IncomeDetail || "Income", cat: i.categories?.CategoryName || "N/A", type: "Inc", amt: parseFloat(i.Amount.toString()) }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 25);

        for (const t of allTransactions) {
            if (currentY < 50) {
                page = pdfDoc.addPage([600, 800]);
                currentY = 750;
            }

            page.drawText(t.date.toISOString().split('T')[0], { x: 50, y: currentY, size: 9, font });
            page.drawText(t.detail.substring(0, 30), { x: 120, y: currentY, size: 9, font });
            page.drawText(t.cat.substring(0, 15), { x: 320, y: currentY, size: 9, font });
            
            const typeColor = t.type === "Inc" ? rgb(0.06, 0.73, 0.51) : rgb(0.94, 0.27, 0.27);
            page.drawText(t.type, { x: 420, y: currentY, size: 9, font: boldFont, color: typeColor });
            
            const amtText = formatINR(t.amt);
            const amtWidth = font.widthOfTextAtSize(amtText, 9);
            page.drawText(amtText, { x: 550 - amtWidth, y: currentY, size: 9, font });

            currentY -= 20;
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="Wealth_Report.pdf"',
                "Content-Type": "application/pdf"
            }
        });

    } catch (error) {
        console.error("PDF Export Error:", error);
        return NextResponse.json({ message: "Failed to export PDF", error: String(error) }, { status: 500 });
    }
}
