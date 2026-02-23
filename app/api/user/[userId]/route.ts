import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const role = searchParams.get("role");
    const isActiveParam = searchParams.get("isActive");

    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (isActiveParam !== null) {
      filter.isActive = isActiveParam === "true";
    }

    const users = await prisma.user.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

//update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }
    const { role, isActive } = await request.json();
    if (!role || !isActive) {
      return NextResponse.json(
        { success: false, error: "User role and isActive are required" },
        { status: 400 },
      );
    }
    const users = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        role,
        isActive,
      },
    });
    if (!users) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update users" },
      { status: 500 },
    );
  }
}
