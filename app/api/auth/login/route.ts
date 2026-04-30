import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user by EmailAddress
        const user = await prisma.users.findUnique({
            where: { EmailAddress: email },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare password with PasswordHash
        const isValid = await comparePassword(password, user.PasswordHash);

        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = signToken({
            userId: user.UserID,
            role: user.role.RoleName,
        });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.UserID,
                name: user.UserName,
                email: user.EmailAddress,
                role: user.role.RoleName,
            },
        });

        // Set the auth cookie
        const cookieToken = signToken({ userId: user.UserID, role: user.role.RoleName });

        // Use the helper to set the cookie
        // Note: setAuthCookie is async because it uses cookies() from next/headers
        // But since we are in an API route, we can also set it directly on the response
        // However, the helper might be better. Let's adjust signToken and setAuthCookie logic.

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { message: error.message || String(error) },
            { status: 500 }
        );
    }
}
