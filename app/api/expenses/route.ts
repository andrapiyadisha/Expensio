import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const categoryId = searchParams.get('categoryId');
        const projectId = searchParams.get('projectId');
        const personId = searchParams.get('personId');
        const search = searchParams.get('search');
        const sort = searchParams.get('sort') || 'date_desc';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // RBAC: Admin sees everything, User sees only their own data
        const where: any = role === "Admin" ? {} : { UserID: userId };

        if (categoryId) where.CategoryID = parseInt(categoryId);
        if (projectId) where.ProjectID = parseInt(projectId);
        if (personId) where.PeopleID = parseInt(personId);
        if (search) {
            where.OR = [
                { ExpenseDetail: { contains: search } },
                { Description: { contains: search } },
            ];
        }
        if (startDate || endDate) {
            where.ExpenseDate = {};
            if (startDate) where.ExpenseDate.gte = new Date(startDate);
            if (endDate) where.ExpenseDate.lte = new Date(endDate);
        }

        let orderBy: any = { ExpenseDate: 'desc' };
        if (sort === 'amount_asc') orderBy = { Amount: 'asc' };
        if (sort === 'amount_desc') orderBy = { Amount: 'desc' };
        if (sort === 'date_asc') orderBy = { ExpenseDate: 'asc' };

        const [expenses, total] = await Promise.all([
            prisma.expenses.findMany({
                where,
                include: { peoples: true, categories: true, sub_categories: true, projects: true },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.expenses.count({ where })
        ]);

        return NextResponse.json({
            data: expenses,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch expenses', error: String(error) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const { ExpenseID } = await req.json();

        // Check ownership
        const existing = await prisma.expenses.findUnique({
            where: { ExpenseID }
        });

        if (!existing) return NextResponse.json({ message: "Expense not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.expenses.delete({
            where: { ExpenseID },
        });

        return NextResponse.json({ message: "Expense Deleted Successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "failed to delete expense", error: String(error) },
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

        if (!data.Amount || parseFloat(data.Amount) <= 0) {
            return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
        }
        if (!data.ExpenseDate) {
            return NextResponse.json({ message: "Expense Date is required" }, { status: 400 });
        }
        if (!data.CategoryID) {
            return NextResponse.json({ message: "Category is required" }, { status: 400 });
        }

        // Remove ID if present to avoid conflicts
        delete data.ExpenseID;

        const expense = await prisma.expenses.create({
            data: {
                ...data,
                Amount: parseFloat(data.Amount),
                CategoryID: parseInt(data.CategoryID),
                SubCategoryID: data.SubCategoryID ? parseInt(data.SubCategoryID) : null,
                PeopleID: data.PeopleID ? parseInt(data.PeopleID) : null,
                ProjectID: data.ProjectID ? parseInt(data.ProjectID) : null,
                UserID: userId, // Set the current user ID
                ExpenseDate: new Date(data.ExpenseDate),
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("POST Expense Error:", error);
        return NextResponse.json({ message: "Failed to create Expense", error: String(error) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const body = await req.json();
        const { ExpenseID, categories, peoples, projects, sub_categories, ...data } = body;

        if (!ExpenseID) return NextResponse.json({ message: "Expense ID is required" }, { status: 400 });

        if (data.Amount && parseFloat(data.Amount) <= 0) {
            return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
        }
        if (!data.ExpenseDate) {
            return NextResponse.json({ message: "Expense Date is required" }, { status: 400 });
        }
        if (!data.CategoryID) {
            return NextResponse.json({ message: "Category is required" }, { status: 400 });
        }

        // Check ownership
        const existing = await prisma.expenses.findUnique({
            where: { ExpenseID }
        });

        if (!existing) return NextResponse.json({ message: "Expense not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const expense = await prisma.expenses.update({
            where: { ExpenseID },
            data: {
                ...data,
                Amount: typeof data.Amount !== 'undefined' ? parseFloat(data.Amount) : undefined,
                CategoryID: typeof data.CategoryID !== 'undefined' ? parseInt(data.CategoryID) : undefined,
                SubCategoryID: data.SubCategoryID ? parseInt(data.SubCategoryID) : null,
                PeopleID: data.PeopleID ? parseInt(data.PeopleID) : null,
                ProjectID: data.ProjectID ? parseInt(data.ProjectID) : null,
                ExpenseDate: typeof data.ExpenseDate !== 'undefined' ? new Date(data.ExpenseDate) : undefined,
            },
        });

        return NextResponse.json(expense);
    }
    catch (error) {
        console.error("PUT Expense Error:", error);
        return NextResponse.json(
            { message: "failed to update expense", error: String(error) },
            { status: 500 }
        );
    }
}
