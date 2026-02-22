import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ fieldId: string }> }) {
    try {
        const { fieldId } = await params;
        const field = await prisma.serviceField.findUnique({
            where: { id: parseInt(fieldId) },
        });
        if (!field) {
            return NextResponse.json({ success: false, error: "Service field not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Service field fetched successfully", data: field });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ fieldId: string }> }) {
    try {
        const { fieldId } = await params;
        const id = parseInt(fieldId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ success: false, error: "Invalid field ID" }, { status: 400 });
        }
        const { label, key, type, isRequired, options } = await req.json();
        const field = await prisma.serviceField.update({
            where: { id },
            data: {
                label,
                key,
                type,
                isRequired,
                options,
            },
        });
        return NextResponse.json({ success: true, message: "Service field updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ fieldId: string }> }) {
    try {
        const { fieldId } = await params;
        const id = parseInt(fieldId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ success: false, error: "Invalid field ID" }, { status: 400 });
        }
        await prisma.serviceField.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, message: "Service field deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
