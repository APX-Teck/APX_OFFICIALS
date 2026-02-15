import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

// export async function POST(req: NextRequest, res:Response) {
//   try {
//     const data = await req.json();

//     const {
//       name,
//       email,
//       phone,
//       message,
//     } = data;

//     // ✅ Basic validation
//     if (!name || !email || !phone || !message) {
//       return NextResponse.json(
//         { ok: false, error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     await prisma.enquiry.create({
//       data: {
//         name,
//         email,
//         phone,
//         message,
//       },
//     });

// //     console.log("ENQUIRY RECEIVED:", data);
// //     console.log("CUSTOMER EMAIL:", email);

// //     // ✅ SMTP Transport
// //     const transporter = nodemailer.createTransport({
// //       host: process.env.SMTP_HOST,
// //       port: Number(process.env.SMTP_PORT || 587),
// //       secure: false,
// //       auth: {
// //         user: process.env.SMTP_USER,
// //         pass: process.env.SMTP_PASS,
// //       },
// //     });

// //     // ✅ 1) ADMIN EMAIL
// //     await transporter.sendMail({
// //       from: `"APX Teck Website" <${process.env.SMTP_USER}>`,
// //       to: "info@apxteck.com",
// //       replyTo: email,
// //       subject: `New Enquiry: ${fullName} (${serviceRequired})`,
// //       text: `
// // New Enquiry Received

// // Full Name: ${fullName}
// // Email: ${email}
// // Phone: ${phone}
// // Business Type: ${businessType}
// // Business Name: ${businessName}
// // Service Required: ${serviceRequired}

// // Message:
// // ${message}

// // Sent from APX Teck Website
// //       `,
// //       html: `
// //         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
// //           <h2>New Enquiry Received</h2>
// //           <p><b>Full Name:</b> ${fullName}</p>
// //           <p><b>Email:</b> ${email}</p>
// //           <p><b>Phone:</b> ${phone}</p>
// //           <p><b>Business Type:</b> ${businessType}</p>
// //           <p><b>Business Name:</b> ${businessName}</p>
// //           <p><b>Service Required:</b> ${serviceRequired}</p>
// //           <p><b>Message:</b><br/>${message}</p>
// //           <hr/>
// //           <p style="color:#777;font-size:12px;">Sent from APX Teck Website Enquiry Form</p>
// //         </div>
// //       `,
// //     });

// //     // ✅ 2) CUSTOMER THANK YOU EMAIL
// //     const customerMail = await transporter.sendMail({
// //       from: `"APX Teck" <${process.env.SMTP_USER}>`,
// //       to: email,
// //       replyTo: "info@apxteck.com",
// //       subject: `Thank you for contacting APX Teck, ${fullName}!`,
// //       text: `Hi ${fullName},

// // Thank you for contacting APX Teck.

// // We have received your enquiry for: ${serviceRequired}

// // Our team will contact you shortly.

// // APX Teck
// // info@apxteck.com
// // 9405282582
// //       `,
// //       html: `
// //         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
// //           <h2>Thank you for your enquiry!</h2>
// //           <p>Hi <b>${fullName}</b>,</p>

// //           <p>
// //             We have received your enquiry for:
// //             <b>${serviceRequired}</b>.
// //           </p>

// //           <p>
// //             Our team will contact you shortly.
// //           </p>

// //           <hr/>

// //           <p><b>APX Teck</b></p>
// //           <p style="margin:0;">Email: info@apxteck.com</p>
// //           <p style="margin:0;">Phone: 9405282582</p>

// //           <p style="color:#777;font-size:12px;margin-top:16px;">
// //             This is an auto-generated email. Please do not reply.
// //           </p>
// //         </div>
// //       `,
// //     });

// //     console.log("CUSTOMER MAIL SENT:", customerMail.messageId);

//     return res.json({ success: true, message: "Email sent successfully" });
//   } catch (err) {
//     console.error("EMAIL ERROR:", err);
//     return res.json({ success: false, message: "Email sending failed" });
//   }
// }


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
