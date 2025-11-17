import type { Metadata } from "next";
// import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const spaceGrotesk = Space_Grotesk({
//   variable: "--font-space-grotesk",
//   subsets: ["latin"],
//   weight: ["300","400","500","600","700"],
//   display: "swap",
// });

export const metadata: Metadata = {
  title: {
    template: "%s | OpenAuditLabs",
    default: "OpenAuditLabs",
  },
  description: "OpenAuditLabs is a platform for managing and conducting security audits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        className="font-sans antialiased"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
