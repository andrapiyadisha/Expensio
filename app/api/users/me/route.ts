import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const fullUser = await prisma.users.findUnique({
            where: { UserID: user.userId },
            select: {
                UserID: true,
                UserName: true,
                EmailAddress: true,
                MobileNo: true,
                ProfileImage: true,
                RoleID: true,
                role: {
                    select: { RoleName: true }
                }
            }
        });

        if (!fullUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json(fullUser);
    } catch (error) {
        console.error("GET /api/users/me Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { UserName, MobileNo, ProfileImage } = await req.json();

        const updatedUser = await prisma.users.update({
            where: { UserID: user.userId },
            data: {
                UserName,
                MobileNo,
                ProfileImage,
                Modified: new Date()
            },
            select: {
                UserID: true,
                UserName: true,
                EmailAddress: true,
                MobileNo: true,
                ProfileImage: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("PUT /api/users/me Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
