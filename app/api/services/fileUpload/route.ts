import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uploadService from "@/lib/service/imagekit/upload";
import { verifyToken } from "@/lib/middleware/roleVerification";

//create file upload
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "CLIENT"])(req);
    if (error) {
      return error;
    }
    const formData = await req.formData();
    const requestId = Number(formData.get("requestId"));
    const file = formData.get("file") as File;

    if (!requestId || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: {
        id: requestId,
      },
    });
    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: "Service request not found" },
        { status: 404 },
      );
    }

    const userFileUploadCount = await prisma.fileUpload.count({
      where: {
        request: {
          userId: serviceRequest.userId,
        },
      },
    });

    const originalNameWithoutExt =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const originalExt = file.name.includes(".");
    const folder = `APX/client-reference`;

    const newFileName = `${serviceRequest.userId}_${originalNameWithoutExt}_${userFileUploadCount}${originalExt ? "." + originalExt : ""}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedFile = await uploadService.uploadDocument(
      buffer,
      newFileName,
      folder,
      ["service-request", requestId.toString()],
    );

    const result = await prisma.fileUpload.create({
      data: {
        requestId,
        fileName: uploadedFile.name,
        fileUrl: uploadedFile.url,
        fileType: file.type,
        docFileId: uploadedFile.fileId,
      },
    });
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

//Get all file uploads for a request
export async function GET(req: NextRequest) {
  try {
    const { error, user } = await verifyToken(["SUPER_ADMIN", "CLIENT"])(req);
    if (error) {
      return error;
    }
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "requestId is required" },
        { status: 400 },
      );
    }

    const fileUploads = await prisma.fileUpload.findMany({
      where: {
        requestId: parseInt(requestId, 10),
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        request: {
          select: {
            id: true,
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "File uploads fetched successfully",
      data: fileUploads,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
