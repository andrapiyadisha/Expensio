import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwt-verify";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = pathname.startsWith("/admin") || pathname.startsWith("/user");

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const payload = await verifyJwt(token, JWT_SECRET);

            if (!payload) {
                throw new Error("Invalid token payload");
            }

            const userRole = (payload as any).role as string;

            if (pathname.startsWith("/admin") && userRole !== "Admin") {
                return NextResponse.redirect(new URL("/user/dashboard", req.url));
            }

            if (pathname.startsWith("/user") && userRole !== "User") {
                if (userRole === "Admin") {
                    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
                }
                return NextResponse.redirect(new URL("/login", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error("Middleware Auth Validation Failed:", error);
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("auth_token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*']
};
