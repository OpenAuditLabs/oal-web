import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "OpenAuditLabs - Security Analysis Dashboard",
  description: "Monitor real-time security analysis and threat detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
      >
  {children}
  <ToastProvider />
      </body>
    </html>
  );
}
