import { prisma } from "@/lib/prisma";
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

    const subCategories = await prisma.sub_categories.findMany({
      where: baseWhere,
      include: { categories: true },
      orderBy: { SubCategoryName: "asc" }
    });
    return NextResponse.json(subCategories);
  }
  catch (error) {
    return NextResponse.json(
      { message: "failed to fetch SubCategories", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role } = user;
    const { SubCategoryID } = await req.json();

    // Check ownership
    const existing = await prisma.sub_categories.findUnique({
      where: { SubCategoryID }
    });

    if (!existing) return NextResponse.json({ message: "SubCategory not found" }, { status: 404 });
    if (role !== "Admin" && existing.UserID !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.sub_categories.delete({ where: { SubCategoryID } });

    return NextResponse.json({ message: "SubCategory Deleted Successfully" });
  }
  catch (error) {
    return NextResponse.json(
      { message: "failed to delete sub-category", error: String(error) },
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

    // Remove ID if present
    delete data.SubCategoryID;

    const subCategory = await prisma.sub_categories.create({
      data: {
        ...data,
        UserID: userId, // Set current user ID
      }
    });
    return NextResponse.json(subCategory);
  } catch (error) {
    console.error("POST SubCategory Error:", error);
    return NextResponse.json(
      { message: "Failed to create sub-category", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role } = user;
    const { SubCategoryID, ...data } = await req.json();
    if (!SubCategoryID) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    // Check ownership
    const existing = await prisma.sub_categories.findUnique({
      where: { SubCategoryID }
    });

    if (!existing) return NextResponse.json({ message: "SubCategory not found" }, { status: 404 });
    if (role !== "Admin" && existing.UserID !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const subCategory = await prisma.sub_categories.update({
      where: { SubCategoryID },
      data,
    });
    return NextResponse.json(subCategory);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update sub-category", error: String(error) },
      { status: 500 }
    );
  }
}