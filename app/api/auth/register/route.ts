import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
    try {
        const { userName, email, password, mobileNo } = await req.json();

        if (!userName || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { EmailAddress: email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Get default 'User' role
        const userRole = await prisma.roles.findFirst({
            where: { RoleName: "User" },
        });

        if (!userRole) {
            return NextResponse.json(
                { message: "Default role 'User' not found in database. Please seed roles." },
                { status: 500 }
            );
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.users.create({
            data: {
                UserName: userName,
                EmailAddress: email,
                PasswordHash: passwordHash,
                MobileNo: mobileNo || "",
                RoleID: userRole.RoleID,
                Created: new Date(),
                Modified: new Date(),
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.UserID },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { message: error.message || String(error) },
            { status: 500 }
        );
    }
}
