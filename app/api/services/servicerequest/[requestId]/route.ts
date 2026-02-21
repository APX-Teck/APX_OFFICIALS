import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serviceRequestValidation } from "@/lib/validation/service.validation";
import { verifyToken } from "@/lib/middleware/roleVerification";

//update service request by id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "CLIENT"])(req);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.requestId, 10);

    const body = await req.json();
    const parsedData = serviceRequestValidation.safeParse(body);

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

    const { assignedToId, status, priority, title, message } = parsedData.data;

    const servicetimeline = await prisma.serviceRequest.findUnique({
      where: {
        id: requestId,
      },
      select: {
        createdAt: true,
      },
    });

    if (!servicetimeline) {
      return NextResponse.json(
        {
          success: false,
          message: "Service request not found",
        },
        { status: 404 },
      );
    }

    const oneHourLater =
      new Date(servicetimeline.createdAt).getTime() + 60 * 60 * 1000;

    if (Date.now() > oneHourLater) {
      return NextResponse.json(
        {
          success: false,
          message: `You can't update service request after one hour, you have update at ${servicetimeline.createdAt.toLocaleString()}`,
        },
        { status: 404 },
      );
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: {
        id: requestId,
      },
      data: {
        assignedToId: assignedToId ?? null,
        status,
        priority,
        title,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service request updated successfully",
        data: serviceRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

//get by serviceRequest by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "ADMIN","CLIENT"])(req);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.requestId, 10);

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service request fetched successfully",
        data: serviceRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching service request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

//delete service request by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const requestId = parseInt(resolvedParams.requestId, 10);

    const serviceRequest = await prisma.serviceRequest.delete({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service request deleted successfully",
        data: serviceRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting service request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}