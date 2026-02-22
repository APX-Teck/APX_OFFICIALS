import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { label, key, type, isRequired, options, serviceId } =
      await req.json();

    if (!label || !key || !type || !serviceId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: label, key, type, and serviceId are required",
        },
        { status: 400 },
      );
    }
    if (!label || !key || !type || !isRequired || !serviceId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 },
      );
    }
    const field = await prisma.serviceField.create({
      data: {
        label,
        key,
        type,
        isRequired,
        options,
        serviceId,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Service field created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const fields = await prisma.serviceField.findMany();
    return NextResponse.json({
      success: true,
      message: "Service fields fetched successfully",
      data: fields,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
