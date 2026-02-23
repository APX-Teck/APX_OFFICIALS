import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//get all users
export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json({ success: true, message:"Users fetched successfully", data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 },
        );
    }
}
