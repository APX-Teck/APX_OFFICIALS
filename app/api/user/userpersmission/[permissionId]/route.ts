import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//delete user permission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ permissionId: string }> },
) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const { permissionId } = resolvedParams;
    const userId = request.nextUrl.searchParams.get("userId");

    if (!permissionId || !userId) {
      return NextResponse.json(
        { success: false, error: "Permission ID and User ID are required" },
        { status: 400 },
      );
    }

    const record = await prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId: Number(userId),
          permissionId: Number(permissionId),
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "User permission not found" },
        { status: 404 },
      );
    }

    const userPermission = await prisma.userPermission.delete({
      where: {
        userId_permissionId: {
          userId: Number(userId),
          permissionId: Number(permissionId),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User permission deleted successfully",
      data: userPermission,
    });
  } catch (error) {
    console.error("Error deleting user permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user permission" },
      { status: 500 },
    );
  }
}

//update user permission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ permissionId: string }> },
) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const oldPermissionId = resolvedParams.permissionId;

    if (!oldPermissionId) {
      return NextResponse.json(
        { success: false, error: "Permission ID URL parameter is required" },
        { status: 400 },
      );
    }

    const { userId, permissionId: newPermissionId } = await request.json();
    if (!userId || !newPermissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and new permission ID are required in body",
        },
        { status: 400 },
      );
    }

    // Checking if the record exists first to provide a better error response
    const record = await prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId: Number(userId),
          permissionId: Number(oldPermissionId),
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "User permission not found to update" },
        { status: 404 },
      );
    }

    const userPermission = await prisma.userPermission.update({
      where: {
        userId_permissionId: {
          userId: Number(userId),
          permissionId: Number(oldPermissionId),
        },
      },
      data: {
        userId: Number(userId),
        permissionId: Number(newPermissionId),
      },
    });

    return NextResponse.json({
      success: true,
      message: "User permission updated successfully",
      data: userPermission,
    });
  } catch (error) {
    console.error("Error updating user permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user permission" },
      { status: 500 },
    );
  }
}
