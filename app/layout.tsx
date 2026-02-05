import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APX Teck — IT Services, Web & App Development",
  description:
    "APX Teck builds premium websites, mobile apps, UI/UX, digital marketing, SEO & branding for modern businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
