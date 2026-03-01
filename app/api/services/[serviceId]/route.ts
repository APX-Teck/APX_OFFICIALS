import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceValidation } from "@/lib/validation/service.validation";

// UPDATE SERVICE
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const { serviceId: serviceIdStr } = await params;
    const serviceId = parseInt(serviceIdStr);

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

    const service = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name,
        description,
        isActive,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json(
      { success: true, message: "Service updated successfully", data: service },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

//get by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    const resolvedParams = await params;
    const serviceId = parseInt(resolvedParams.serviceId, 10);

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        fields: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Service fetched successfully", data: service },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE SERVICE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const resolvedParams = await params;
    const serviceId = parseInt(resolvedParams.serviceId, 10);

    const service = await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Service deleted successfully", data: service },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
