import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceRequestDataValidation } from "@/lib/validation/service.validation";

// GET SERVICE REQUEST DATA BY ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ requestdataId: string }> }) {
    try {
        const { error, user } = await verifyToken(["CLIENT"])(req);
        if (error) {
            return error;
        }

        const resolvedParams = await params;
        const requestdataId = parseInt(resolvedParams.requestdataId);

        const serviceRequestData = await prisma.serviceRequestData.findUnique({
            where: {
                id: requestdataId,
            },
        });

        return NextResponse.json(
            { success: true, message: "Service request data fetched successfully", data: serviceRequestData },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching service request data:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// UPDATE SERVICE REQUEST DATA BY ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ requestdataId: string }> }) {
    try {
        const { error, user } = await verifyToken(["CLIENT"])(req);
        if (error) {
            return error;
        }

        const resolvedParams = await params;
        const requestdataId = parseInt(resolvedParams.requestdataId);

        const body = await req.json();
        const parsedData = serviceRequestDataValidation.safeParse(body);

        if (!parsedData.success) {
            const flattenedErrors = parsedData.error.flatten();

            return NextResponse.json(
                {
                    success: false,
                    message: "Validation Failed",
                    error: flattenedErrors.fieldErrors,
                },
                { status: 400 },
            );
        }

        const { requestId, fields, value } = parsedData.data;

        if (!requestId || !fields || !value) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: requestId, fields, or value",
                },
                { status: 400 },
            );
        }

        const serviceRequestData = await prisma.serviceRequestData.update({
            where: {
                id: requestdataId,
            },
            data: {
                requestId,
                fieldKey: fields,
                value,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Service request data updated successfully",
                data: serviceRequestData,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating service request data:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE SERVICE REQUEST DATA BY ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ requestdataId: string }> }) {
    try {
        const { error, user } = await verifyToken(["SUPER_ADMIN","CLIENT"])(req);
        if (error) {
            return error;
        }

        const resolvedParams = await params;
        const requestdataId = parseInt(resolvedParams.requestdataId);

        const serviceRequestData = await prisma.serviceRequestData.delete({
            where: {
                id: requestdataId,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Service request data deleted successfully",
                data: serviceRequestData,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting service request data:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
