import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//soft delete user
export async function DELETE(
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
    const users = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        isActive: false,
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
      message: "User deleted successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete users" },
      { status: 500 },
    );
  }
}
