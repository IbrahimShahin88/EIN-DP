import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EIN-DPW SMS",
  description: "EIN-DPW Security Management System.",
  icons: {
    icon: "/ein-dpw-icon.png",
    apple: "/ein-dpw-icon.png",
  },
  applicationName: "EIN-DPW SMS",
};

export const viewport: Viewport = {
  themeColor: "#061527",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
