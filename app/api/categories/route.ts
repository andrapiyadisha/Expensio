import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;

        const isAdmin = role && role.toLowerCase() === "admin";
        
        // Admin sees all. Normal users see their own categories + the Admin's default categories (UserID: 1)
        const baseWhere = isAdmin ? {} : {
            OR: [
                { UserID: userId },
                { UserID: 1 }
            ]
        };

        const categories = await prisma.categories.findMany({
            where: baseWhere,
            include: {
                sub_categories: true
            },
            orderBy: { CategoryName: "asc" }
        });
        
        console.log(`[GET /api/categories] User: ${userId}, Role: ${role}, isAdmin: ${isAdmin}, Categories returned: ${categories.length}`);
        
        return NextResponse.json(categories);
    }
    catch (error) {
        console.error("[GET /api/categories] Error:", error);
        return NextResponse.json(
            { message: "Failed to fetch categories", error: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const { CategoryID } = await req.json();

        // Check ownership
        const existing = await prisma.categories.findUnique({
            where: { CategoryID }
        });

        if (!existing) return NextResponse.json({ message: "Category not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.categories.delete({
            where: { CategoryID }
        });

        return NextResponse.json({ message: "Category Deleted Successfully" })
    }
    catch (error) {
        return NextResponse.json(
            { message: "Failed to delete category", error: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId } = user;
        const data = await req.json();

        // Remove ID if present to avoid conflicts
        delete data.CategoryID;

        const category = await prisma.categories.create({
            data: {
                ...data,
                UserID: userId, // Set current user ID
            },
        });

        return NextResponse.json(category);
    }
    catch (error) {
        console.error("POST Category Error:", error);
        return NextResponse.json(
            { message: "Failed to create category", error: String(error) },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const { CategoryID, ...data } = await req.json();
        if (!CategoryID) return NextResponse.json({ message: "ID is required" }, { status: 400 });

        // Check ownership
        const existing = await prisma.categories.findUnique({
            where: { CategoryID }
        });

        if (!existing) return NextResponse.json({ message: "Category not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const category = await prisma.categories.update({
            where: { CategoryID },
            data,
        });
        return NextResponse.json(category);
    }
    catch (error) {
        return NextResponse.json(
            { message: "Failed to update category", error: String(error) },
            { status: 500 }
        )
    }
}