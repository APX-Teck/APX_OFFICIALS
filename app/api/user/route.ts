import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";

//get all users
export async function GET(request: NextRequest) {
  try {
    const {error,user} = await verifyToken(["SUPER_ADMIN"])(request);
    if(error){
        return error;
    }
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

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
