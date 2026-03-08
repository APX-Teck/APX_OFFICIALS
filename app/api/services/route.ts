import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/middleware/roleVerification";
import { serviceValidation } from "@/lib/validation/service.validation";
import { imagekit } from "@/lib/service/imagekit/upload";

//create service
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN"])(req);
    if (error) {
      return error;
    }

    const formData = await req.formData();

    const file = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Thumbnail image file is required",
          error: "Missing file",
        },
        { status: 400 },
      );
    }
    const parsedData = serviceValidation.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      isActive: formData.has("isActive")
        ? formData.get("isActive") === "true"
        : undefined,
      slug: formData.get("slug") || undefined,
      thumbnail: formData.get("thumbnail"),
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
    // CREATE SERVICE IN DB
    const service = await prisma.service.create({
      data: {
        name,
        description,
        isActive,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
    //UPLOAD SERVICE IMAGE
    let uploadResult;
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop() || "jpg";
      const safeTitle = name.replace(/[^a-zA-Z0-9]/g, "-");
      const fileName = `${service.id}-${safeTitle}.${fileExtension}`;

      uploadResult = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        useUniqueFileName: false,
        folder: "/APX/SERVICES",
      });
    } catch (uploadError: any) {
      // Rollback: delete the recently created service to prevent orphaned records
      await prisma.service
        .delete({ where: { id: service.id } })
        .catch(console.error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload thumbnail to ImageKit",
          error: uploadError,
        },
        { status: 500 },
      );
    }

    //UPDATE IMAGE DATA
    let finalService;
    try {
      finalService = await prisma.service.update({
        where: { id: service.id },
        data: {
          thumbnail: uploadResult.url,
          thumbnailFieldId: uploadResult.fileId,
        },
      });
    } catch (updateError: any) {
      // Rollback: delete the service if the update fails to prevent a service without a thumbnail
      await prisma.service
        .delete({ where: { id: service.id } })
        .catch(console.error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update service with thumbnail URL",
          error: updateError,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: finalService,
      },
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
    // const { error } = await verifyToken(["SUPER_ADMIN"])(req);
    // if (error) return error;

    const { searchParams } = new URL(req.url);

    const serviceName = searchParams.get("name")?.trim();
    const serviceDescription = searchParams.get("description")?.trim();

    const where: any = {};

    // If name filter exists
    if (serviceName) {
      where.name = {
        contains: serviceName,
        mode: "insensitive",
      };
    }

    // If description filter exists
    if (serviceDescription) {
      where.description = {
        contains: serviceDescription,
        mode: "insensitive",
      };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        fields: true,
      },
      orderBy: {
        createdAt: "desc",
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
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
