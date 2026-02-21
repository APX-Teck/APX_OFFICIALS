import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceRequestDataValidation } from "@/lib/validation/service.validation";

// CREATE SERVICE REQUEST DATA
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["CLIENT"])(req);
    if (error) {
      return error;
    }

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

    const serviceRequestData = await prisma.serviceRequestData.create({
      data: {
        requestId,
        fieldKey: fields,
        value,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service request data created successfully",
        data: serviceRequestData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service request data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET ALL ACTIVE SERVICES
export async function GET(req: NextRequest) {
  try {

    const services = await prisma.serviceRequestData.findMany();

    return NextResponse.json({ success: true, message: "Services fetched successfully", data: services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

