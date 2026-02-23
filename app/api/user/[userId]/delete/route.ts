import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//soft delete user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { error, user } = verifyToken(["SUPER_ADMIN"])(request);
    if (error) return error;

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const id = parseInt(userId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // 🔥 Prevent Super Admin deleting himself
    if (existingUser.id === user!.id) {
      return NextResponse.json(
        { success: false, error: "You cannot deactivate yourself" },
        { status: 400 },
      );
    }

    // 🔁 Toggle logic
    const newStatus = !existingUser.isActive;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: newStatus
        ? "User activated successfully"
        : "User deactivated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Full Error:", error);
    console.error("Error Message:", error?.message);
    console.error("Error Stack:", error?.stack);

    return NextResponse.json(
      { success: false, error: "Failed to update user status" },
      { status: 500 },
    );
  }
}
