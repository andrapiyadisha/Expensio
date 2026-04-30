import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Auth Me Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
