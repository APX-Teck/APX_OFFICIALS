import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uploadService from "@/lib/service/imagekit/upload";

//create file upload
export async function POST(req: NextRequest) {
  try {
    
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
    const originalExt = file.name.includes(".")
      ? file.name.split(".").pop()
      : "";

    const newFileName = `${serviceRequest.userId}_${originalNameWithoutExt}_${userFileUploadCount}${originalExt ? "." + originalExt : ""}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const folder = `APX/client-refrence`;

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
    const fileUploads = await prisma.fileUpload.findMany({
      include: {
        request: {
          select: {
            id: true,
            userId: true,
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

