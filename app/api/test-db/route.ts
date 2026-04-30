import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.categories.findMany({
            include: { sub_categories: true }
        });
        return NextResponse.json({ success: true, count: categories.length, categories });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stack: e.stack });
    }
}
