import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uploadService from "@/lib/service/imagekit/upload";

//get file upload by id
export async function GET(
  req: NextRequest,
  { params }: { params: { uploadId: string } },
) {
  try {
    const uploadId = Number(params.uploadId);
    if (!uploadId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
    const fileUpload = await prisma.fileUpload.findUnique({
      where: {
        id: uploadId,
      },
    });
    
    if (!fileUpload) {
      return NextResponse.json(
        { success: false, error: "File upload not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "File upload fetched successfully",
      data: fileUpload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

//delete file
export async function DELETE(
  req: NextRequest,
  { params }: { params: { uploadId: string } },
) {
  try {
    const uploadId = Number(params.uploadId);
    if (!uploadId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
    const existingFileUpload = await prisma.fileUpload.findUnique({
      where: {
        id: uploadId,
      },
    });
    if (!existingFileUpload) {
      return NextResponse.json(
        { success: false, error: "File upload not found" },
        { status: 404 },
      );
    }
    await uploadService.deleteImage(existingFileUpload.docFileId);
    //need handle error handling
    const fileUpload = await prisma.fileUpload.delete({
      where: {
        id: uploadId,
      },
    });
    return NextResponse.json({
      success: true,
      message: "File upload deleted successfully",
      data: fileUpload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

//update file
export async function PUT(
  req: NextRequest,
  { params }: { params: { uploadId: string } },
) {
  try {
    const uploadId = Number(params.uploadId);
    if (!uploadId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
        const formData = await req.formData();
        const file = formData.get("file") as File;
    
        if (!file) {
          return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 },
          );
        }

    const existingFileUpload = await prisma.fileUpload.findUnique({
      where: {
        id: uploadId,
      },
    });

    let uploadedFile;

    if (!existingFileUpload) {
      return NextResponse.json(
        { success: false, error: "File upload not found" },
        { status: 404 },
      );
    }else{
        const deletedFile = await uploadService.deleteImage(existingFileUpload.docFileId);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const folder = `APX/client-refrence`;
        uploadedFile = await uploadService.uploadDocument(
            buffer,
            existingFileUpload.fileName,
            folder,
            ["service-request", existingFileUpload.requestId.toString()],
        );
    }

    const fileUpload = await prisma.fileUpload.update({
      where: {
        id: uploadId,
      },
      data: {
        docFileId: uploadedFile.fileId,
        fileUrl: uploadedFile.url,
        fileName: uploadedFile.name,
        fileType: file.type,
      }
    });
    return NextResponse.json({
      success: true,
      message: "File upload updated successfully",
      data: fileUpload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

