import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//create user permission
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(request);
    if (error) {
      return error;
    }
    const { userId, permissionId } = await request.json();
    if (!userId || !permissionId) {
      return NextResponse.json(
        { success: false, error: "User ID and permission ID are required" },
        { status: 400 },
      );
    }
    const userPermission = await prisma.userPermission.create({
      data: {
        userId,
        permissionId,
      },
    });
    return NextResponse.json({
      success: true,
      message: "User permission created successfully",
      data: userPermission,
    });
  } catch (error) {
    console.error("Error creating user permission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user permission" },
      { status: 500 },
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
    const permissions = await prisma.permission.findMany();
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
