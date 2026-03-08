import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceValidation } from "@/lib/validation/service.validation";
import UploadService from "@/lib/service/imagekit/upload";

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

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    const parsedData = serviceValidation.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      isActive: formData.has("isActive")
        ? formData.get("isActive") === "true"
        : undefined,
      slug: formData.get("slug") || undefined,
      thumbnail: formData.has("thumbnail")
        ? formData.get("thumbnail")
        : undefined,
    });

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

    // existing service
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    let updatedThumbnailUrl = existingService.thumbnail;
    let updatedThumbnailFieldId = existingService.thumbnailFieldId;

    if (file) {
      // delete old image
      if (existingService.thumbnailFieldId) {
        try {
          await UploadService.deleteImage(existingService.thumbnailFieldId);
        } catch (e) {
          console.error("Failed to delete old image:", e);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop() || "jpg";
      const safeTitle = name.replace(/[^a-zA-Z0-9]/g, "-");
      const fileName = `${existingService.id}-${safeTitle}.${fileExtension}`;

      const uploadResult = await UploadService.uploadDocument(
        buffer,
        fileName,
        "/APX/SERVICES",
      );
      updatedThumbnailUrl = uploadResult.url;
      updatedThumbnailFieldId = uploadResult.fileId;
    }

    const service = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name,
        description,
        isActive,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        thumbnail: updatedThumbnailUrl,
        thumbnailFieldId: updatedThumbnailFieldId,
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

    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 },
      );
    }

    if (existingService.thumbnailFieldId) {
      try {
        await UploadService.deleteImage(existingService.thumbnailFieldId);
      } catch (e) {
        console.error("Failed to delete image:", e);
      }
    }

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
