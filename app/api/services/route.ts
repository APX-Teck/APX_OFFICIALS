import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceValidation } from "@/lib/validation/service.validation";

//create service
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const body = await req.json();
    const parsedData = serviceValidation.safeParse(body);

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

    const { name, description, isActive, slug } = parsedData.data;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        isActive,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json(
      { success: true, message: "Service created successfully", data: service },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error },
      { status: 500 },
    );
  }
}

// GET ALL ACTIVE SERVICES
export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        fields: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Services fetched successfully",
        data: services,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error },
      { status: 500 },
    );
  }
}
