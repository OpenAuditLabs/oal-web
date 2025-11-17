import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



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
        className="font-sans antialiased"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
