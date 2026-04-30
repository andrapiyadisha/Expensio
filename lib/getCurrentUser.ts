import { cookies } from "next/headers";
import { verifyJwt } from "./jwt-verify";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return null;

        const payload = await verifyJwt(token, JWT_SECRET);

        if (!payload || !payload.userId || !payload.role) {
            return null;
        }

        const userId = parseInt(payload.userId as string, 10);

        const user = await prisma.users.findUnique({
            where: { UserID: userId },
            select: { UserName: true }
        });

        return {
            userId: userId,
            role: payload.role as string,
            name: user?.UserName || payload.name || "User"
        };
    } catch (error) {
        console.error("getCurrentUser Error:", error);
        return null;
    }
}
