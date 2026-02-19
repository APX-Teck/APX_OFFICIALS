import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId: userIdStr } = await params;
    const userId = Number(userIdStr);
    console.log("you enter in me route with id :", userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User found",
      data: { user },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
