import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const {key,description} = await request.json();
        if(!key || !description){
            return NextResponse.json({ success: false, error: "Permission key and description are required" }, { status: 400 });
        }
        const permissions = await prisma.permission.create({
            data: {
                key,
                description,
            },
        });
        return NextResponse.json({ success: true, message:"Permission created successfully", data: permissions });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch permissions" },
            { status: 500 },
        );
    }
}

//get all permissions
export async function GET(request: Request) {
    try {
        const permissions = await prisma.permission.findMany();
        return NextResponse.json({ success: true, message:"Permissions fetched successfully", data: permissions });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch permissions" },
            { status: 500 },
        );
    }
}
