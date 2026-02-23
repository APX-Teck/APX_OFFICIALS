import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request,{params}: { params: Promise<{ permissionId: string }> }) {
    try {
        const {permissionId} = await params;
        if(!permissionId){
            return NextResponse.json({ success: false, error: "Permission ID is required" }, { status: 400 });
        }
        const permissions = await prisma.permission.findUnique({
            where: {
                id: parseInt(permissionId),
            },
        });
        if(!permissions){
            return NextResponse.json({ success: false, error: "Permission not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message:"Permission fetched successfully", data: permissions });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch permissions" },
            { status: 500 },
        );
    }
}

//update permission
export async function PUT(request: Request,{params}: { params: Promise<{ permissionId: string }> }) {
    try {
        const {permissionId} = await params;
        if(!permissionId){
            return NextResponse.json({ success: false, error: "Permission ID is required" }, { status: 400 });
        }
        const {key,description} = await request.json();
        if(!key || !description){
            return NextResponse.json({ success: false, error: "Permission key and description are required" }, { status: 400 });
        }
        const permissions = await prisma.permission.update({
            where: {
                id: parseInt(permissionId),
            },
            data: {
                key,
                description,
            },
        });
        if(!permissions){
            return NextResponse.json({ success: false, error: "Permission not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message:"Permission updated successfully", data: permissions });
    } catch (error) {
        console.error("Error updating permissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update permissions" },
            { status: 500 },
        );
    }
}

//delete permission
export async function DELETE(request: Request,{params}: { params: Promise<{ permissionId: string }> }) {
    try {
        const {permissionId} = await params;
        if(!permissionId){
            return NextResponse.json({ success: false, error: "Permission ID is required" }, { status: 400 });
        }
        const permissions = await prisma.permission.delete({
            where: {
                id: parseInt(permissionId),
            },
        });
        if(!permissions){
            return NextResponse.json({ success: false, error: "Permission not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message:"Permission deleted successfully", data: permissions });
    } catch (error) {
        console.error("Error deleting permissions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete permissions" },
            { status: 500 },
        );
    }
}