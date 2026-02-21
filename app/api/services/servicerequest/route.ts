import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceRequestValidation } from "@/lib/validation/service.validation";

//create service request
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["CLIENT"])(req);
    if (error) {
      return error;
    }
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

    const { assignedToId, status, priority, title, message, serviceId } =
      parsedData.data;

    if (serviceId === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Failed",
          error: { serviceId: ["Service ID is required"] },
        },
        { status: 400 },
      );
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId: user!.id,
        serviceId,
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
        message: "Service request created successfully",
        data: serviceRequest,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

//get all service requests
export async function GET(
  req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "ADMIN"])(req);
    if (error) {
      return error;
    }

    const serviceRequest = await prisma.serviceRequest.findMany({
      include: {
        user: true,
        assignedTo: true,
        service: true,
        requestData: true,
        files: true,
        payments: true,
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
