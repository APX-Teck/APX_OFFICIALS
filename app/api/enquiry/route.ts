import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      fullName,
      email,
      phone,
      businessType,
      businessName,
      serviceRequired,
      message,
    } = data;

    // ✅ Google Auth (Service Account JSON)
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), "services", "sheets.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ✅ Append Row (No Sheet Tab Name)
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("en-IN"),
            fullName,
            email,
            phone,
            businessType,
            businessName,
            serviceRequired,
            message,
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SHEETS ERROR:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
