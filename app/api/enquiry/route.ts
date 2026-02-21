import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { name, email, phone, message } = data;

    // ✅ Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Save enquiry in DB
    await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    // ✅ Success response
    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ENQUIRY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting enquiry",
        data: error,
      },
      { status: 500 }
    );
  }
}


export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};
