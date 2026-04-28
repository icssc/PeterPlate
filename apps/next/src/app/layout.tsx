import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootClient } from "./layout-client";

export const metadata: Metadata = {
  title: "PeterPlate",
  description: `PeterPlate: A dynamic web app to discover everything UCI's dining 
                halls have to offer - from daily menus and special events to 
                dining hall features and updates.`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PeterPlate",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0064a4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
}
