import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { userValidation } from "@/lib/validation/user.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
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
    const { error, user } = verifyToken(["SUPER_ADMIN"])(request);
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

    const id = parseInt(userId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 },
      );
    }

    const parseData = userValidation.parse(await request.json());

    if (!parseData) {
      return NextResponse.json(
        { success: false, error: "Invalid user data" },
        { status: 400 },
      );
    }
    const { email, phone, fullName, role, isActive } = parseData;

    if (!role || isActive === undefined) {
      return NextResponse.json(
        { success: false, error: "User role and isActive are required" },
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

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        phone,
        fullName,
        role,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}
