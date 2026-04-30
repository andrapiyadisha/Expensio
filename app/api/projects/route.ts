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

    const projects = await prisma.projects.findMany({
      where: baseWhere,
      include: {
        expenses: {
          select: { Amount: true }
        }
      },
      orderBy: { ProjectName: "asc" }
    });

    const projectsWithSpent = projects.map(project => ({
      ...project,
      Spent: project.expenses.reduce((sum, exp) => sum + parseFloat(exp.Amount.toString()), 0),
      Budget: project.Budget ? parseFloat(project.Budget.toString()) : 0,
      expenses: undefined
    }));

    return NextResponse.json(projectsWithSpent);
  } catch (error) {
    return NextResponse.json(
      { message: "failed to fetch Projects", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role } = user;
    const body = await req.json();
    console.log("[DELETE /api/projects] Body:", body);
    const { ProjectID } = body;

    // Check ownership
    const existing = await prisma.projects.findUnique({
      where: { ProjectID }
    });

    if (!existing) return NextResponse.json({ message: "Project not found" }, { status: 404 });
    const isAdmin = role && role.toLowerCase() === "admin";
    if (!isAdmin && existing.UserID !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.projects.delete({ where: { ProjectID } });

    return NextResponse.json({ message: "Project Deleted Successfully" });
  }
  catch (error) {
    console.error("[DELETE /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Failed to delete project", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role } = user;
    const data = await req.json();
    console.log("[PUT /api/projects] Incoming Data:", data);
    
    const { ProjectID, ...updateData } = data;
    if (!ProjectID) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    // Check ownership
    const existing = await prisma.projects.findUnique({
      where: { ProjectID }
    });

    if (!existing) return NextResponse.json({ message: "Project not found" }, { status: 404 });
    const isAdmin = role && role.toLowerCase() === "admin";
    if (!isAdmin && existing.UserID !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    console.log("[PUT /api/projects] Updating project:", ProjectID);
    
    // Clean data payload, rejecting fields like 'Spent', 'Created', 'Modified', 'expenses' that are returned in GET
    const {
      ProjectName,
      ProjectDetail,
      Description,
      IsActive,
      ProjectStartDate,
      ProjectEndDate,
      Budget,
      Progress
    } = updateData;

    const project = await prisma.projects.update({
      where: { ProjectID },
      data: {
        ProjectName,
        ProjectDetail,
        Description,
        IsActive,
        ProjectStartDate: ProjectStartDate ? new Date(ProjectStartDate).toISOString() : null,
        ProjectEndDate: ProjectEndDate ? new Date(ProjectEndDate).toISOString() : null,
        Budget: Budget ? parseFloat(Budget.toString()) : undefined,
        Progress: Progress !== undefined && Progress !== null ? parseInt(Progress.toString()) : undefined,
      },
    });
    console.log("[PUT /api/projects] Update Success");
    return NextResponse.json(project);
  } catch (error) {
    console.error("[PUT /api/projects] Error:", error);
    return NextResponse.json(
      { message: "Failed to update project", error: String(error) },
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
    delete data.ProjectID;

    // Clean data payload before creating, same as PUT
    const {
      ProjectName,
      ProjectDetail,
      Description,
      IsActive,
      ProjectStartDate,
      ProjectEndDate,
      Budget,
      Progress
    } = data;

    const project = await prisma.projects.create({
      data: {
        ProjectName,
        ProjectDetail,
        Description,
        IsActive,
        ProjectStartDate: ProjectStartDate ? new Date(ProjectStartDate).toISOString() : null,
        ProjectEndDate: ProjectEndDate ? new Date(ProjectEndDate).toISOString() : null,
        Budget: Budget ? parseFloat(Budget.toString()) : 0,
        Progress: Progress ? parseInt(Progress.toString()) : 0,
        UserID: userId, // Set current user ID
      }
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("POST Project Error:", error);
    return NextResponse.json(
      { message: "Failed to create project", error: String(error) },
      { status: 500 }
    );
  }
}