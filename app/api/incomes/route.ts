import { prisma } from "@/lib/prisma"
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
                { IncomeDetail: { contains: search } },
                { Description: { contains: search } },
            ];
        }
        if (startDate || endDate) {
            where.IncomeDate = {};
            if (startDate) where.IncomeDate.gte = new Date(startDate);
            if (endDate) where.IncomeDate.lte = new Date(endDate);
        }

        let orderBy: any = { IncomeDate: 'desc' };
        if (sort === 'amount_asc') orderBy = { Amount: 'asc' };
        if (sort === 'amount_desc') orderBy = { Amount: 'desc' };
        if (sort === 'date_asc') orderBy = { IncomeDate: 'asc' };

        const [incomes, total] = await Promise.all([
            prisma.incomes.findMany({
                where,
                include: { peoples: true, categories: true, sub_categories: true, projects: true },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.incomes.count({ where })
        ]);

        return NextResponse.json({
            data: incomes,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch incomes', error: String(error) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const { IncomeID } = await req.json();

        // Check ownership
        const existing = await prisma.incomes.findUnique({
            where: { IncomeID }
        });

        if (!existing) return NextResponse.json({ message: "Income not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.incomes.delete({ where: { IncomeID } });

        return NextResponse.json({ message: "Income Deleted Successfully" });
    }
    catch (error) {
        return NextResponse.json(
            { message: "Failed to delete income", error: String(error) },
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
        if (!data.IncomeDate) {
            return NextResponse.json({ message: "Income Date is required" }, { status: 400 });
        }

        // Remove ID if present to avoid conflicts
        delete data.IncomeID;

        const income = await prisma.incomes.create({
            data: {
                ...data,
                Amount: parseFloat(data.Amount),
                CategoryID: data.CategoryID ? parseInt(data.CategoryID) : null,
                SubCategoryID: data.SubCategoryID ? parseInt(data.SubCategoryID) : null,
                PeopleID: data.PeopleID ? parseInt(data.PeopleID) : null,
                ProjectID: data.ProjectID ? parseInt(data.ProjectID) : null,
                UserID: userId, // Set current user ID
                IncomeDate: new Date(data.IncomeDate),
            },
        });

        return NextResponse.json(income);
    } catch (error) {
        console.error("POST Income Error:", error);
        return NextResponse.json({ message: "Failed to create incomes", error: String(error) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const body = await req.json();
        const { IncomeID, categories, peoples, projects, sub_categories, ...data } = body;

        if (!IncomeID) return NextResponse.json({ message: "Income ID is required" }, { status: 400 });

        if (data.Amount && parseFloat(data.Amount) <= 0) {
            return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
        }

        // Check ownership
        const existing = await prisma.incomes.findUnique({
            where: { IncomeID }
        });

        if (!existing) return NextResponse.json({ message: "Income not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const income = await prisma.incomes.update({
            where: { IncomeID },
            data: {
                ...data,
                Amount: typeof data.Amount !== 'undefined' ? parseFloat(data.Amount) : undefined,
                CategoryID: typeof data.CategoryID !== 'undefined' ? parseInt(data.CategoryID) : undefined,
                SubCategoryID: data.SubCategoryID ? parseInt(data.SubCategoryID) : null,
                PeopleID: data.PeopleID ? parseInt(data.PeopleID) : null,
                ProjectID: data.ProjectID ? parseInt(data.ProjectID) : null,
                IncomeDate: typeof data.IncomeDate !== 'undefined' ? new Date(data.IncomeDate) : undefined,
            },
        });

        return NextResponse.json(income);
    }
    catch (error) {
        console.error("PUT Income Error:", error);
        return NextResponse.json(
            { message: "Failed to update income", error: String(error) },
            { status: 500 }
        );
    }
}
