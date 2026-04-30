import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;

        const isAdmin = role && role.toLowerCase() === "admin";
        
        // Admin sees all. Normal users see their own + the Admin's default (UserID: 1)
        const baseWhere = isAdmin ? {} : {
            OR: [
                { UserID: userId },
                { UserID: 1 }
            ]
        };

        const peoples = await prisma.peoples.findMany({
            where: baseWhere,
            orderBy: { PeopleName: 'asc' }
        });

        return NextResponse.json(peoples);
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch peoples', error: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;
        const { PeopleID } = await req.json();

        // Check ownership
        const existing = await prisma.peoples.findUnique({
            where: { PeopleID }
        });

        if (!existing) return NextResponse.json({ message: "Person not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.peoples.delete({ where: { PeopleID } });

        return NextResponse.json({ message: "Peoples Deleted Successfully" })
    }
    catch (error) {
        return NextResponse.json(
            { message: "Failed to delete person", error: String(error) },
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
        delete data.PeopleID;

        const people = await prisma.peoples.create({
            data: {
                ...data,
                UserID: userId, // Set current user ID
            },
        });

        return NextResponse.json(people);
    }
    catch (error) {
        console.error("POST People Error:", error);
        return NextResponse.json(
            { message: "Failed to create people", error: String(error) },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { userId, role } = user;

        const { PeopleID, ...data } = await req.json();
        if (!PeopleID) return NextResponse.json({ message: "ID is required" }, { status: 400 });

        // Check ownership
        const existing = await prisma.peoples.findUnique({
            where: { PeopleID }
        });

        if (!existing) return NextResponse.json({ message: "Person not found" }, { status: 404 });
        if (role !== "Admin" && existing.UserID !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const people = await prisma.peoples.update({
            where: { PeopleID },
            data,
        });
        return NextResponse.json(people);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update people", error: String(error) },
            { status: 500 }
        );
    }
}