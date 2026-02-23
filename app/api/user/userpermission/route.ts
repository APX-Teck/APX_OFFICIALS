import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//create user permission
export async function POST(request: NextRequest) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) return error;

    const body = await request.json();
    const { userId, permissionId } = body;

    if (!userId || !permissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId and permissionId are required",
        },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    const permissionIdNum = Number(permissionId);

    if (isNaN(userIdNum) || isNaN(permissionIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid userId or permissionId",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userIdNum },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionIdNum },
    });

    if (!existingPermission) {
      return NextResponse.json(
        { success: false, error: "Permission not found" },
        { status: 404 }
      );
    }

      const alreadyAssigned = await prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId: userIdNum,
          permissionId: permissionIdNum,
        },
      },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        {
          success: false,
          error: "Permission already assigned to this user",
        },
        { status: 400 }
      );
    }

    const userPermission = await prisma.userPermission.create({
      data: {
        userId: userIdNum,
        permissionId: permissionIdNum,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Permission assigned successfully",
        data: userPermission,
      },
      { status: 201 }
    );

  } catch (error: any) {

    console.error("Error assigning permission:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

//get all permissions
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }
    const permissions = await prisma.userPermission.findMany({
      include: {
        user: true,
        permission: true,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch permissions" },
      { status: 500 },
    );
  }
}

//update user permission
export async function PUT(request: NextRequest) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) return error;

    const { userId, oldPermissionId, newPermissionId } =
      await request.json();

    if (!userId || !oldPermissionId || !newPermissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, oldPermissionId and newPermissionId are required",
        },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    const oldPermissionIdNum = Number(oldPermissionId);
    const newPermissionIdNum = Number(newPermissionId);

    if (
      isNaN(userIdNum) ||
      isNaN(oldPermissionIdNum) ||
      isNaN(newPermissionIdNum)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    // 🚫 Prevent same permission update
    if (oldPermissionIdNum === newPermissionIdNum) {
      return NextResponse.json(
        { success: false, error: "New permission must be different" },
        { status: 400 }
      );
    }

    // 🔎 Check user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userIdNum },
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 🔎 Check old mapping exists
    const existingMapping = await prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId: userIdNum,
          permissionId: oldPermissionIdNum,
        },
      },
    });

    if (!existingMapping) {
      return NextResponse.json(
        { success: false, error: "Existing permission mapping not found" },
        { status: 404 }
      );
    }

    // 🔎 Check new permission exists
    const permissionExists = await prisma.permission.findUnique({
      where: { id: newPermissionIdNum },
    });

    if (!permissionExists) {
      return NextResponse.json(
        { success: false, error: "New permission not found" },
        { status: 404 }
      );
    }

    // 🔄 Use transaction (atomic operation)
    const newMapping = await prisma.$transaction(async (tx) => {
      await tx.userPermission.delete({
        where: {
          userId_permissionId: {
            userId: userIdNum,
            permissionId: oldPermissionIdNum,
          },
        },
      });

      return tx.userPermission.create({
        data: {
          userId: userIdNum,
          permissionId: newPermissionIdNum,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "User permission updated successfully",
      data: newMapping,
    });

  } catch (error: any) {

    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Permission already assigned" },
        { status: 400 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { success: false, error: "Foreign key constraint failed" },
        { status: 400 }
      );
    }

    console.error("Error updating user permission:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

//delete user permission
export async function DELETE(
  request: NextRequest
) {
  try {
    const { error } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }

    const { permissionId, userId } = await request.json();

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