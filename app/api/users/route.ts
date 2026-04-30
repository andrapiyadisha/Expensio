import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-verify";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

async function getAuthSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await verifyJwt(token, JWT_SECRET);
}

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || (session as any).role !== "Admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const users = await prisma.users.findMany({
            include: { role: true },
            orderBy: { UserName: 'asc' }
        });
        return NextResponse.json(users);
    }
    catch (error) {
        return NextResponse.json(
            { message: "failed to fetch users", error: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session || (session as any).role !== "Admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { UserID } = await req.json();

        await prisma.users.delete({ where: { UserID } });

        return NextResponse.json({ message: "User deleted" });
    }
    catch (error) {
        return NextResponse.json(
            { message: "failed to Delete", error: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session || (session as any).role !== "Admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const data = await req.json();
        const user = await prisma.users.create({ data });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create user", error: String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session || (session as any).role !== "Admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { UserID, ...data } = await req.json();
        const user = await prisma.users.update({
            where: { UserID },
            data,
        });

        return NextResponse.json(user);
    }
    catch (error) {
        return NextResponse.json(
            { message: "failed to update", error: String(error) },
            { status: 500 }
        )
    }
}