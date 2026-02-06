import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { RootClient } from "./layout-client";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZotMeal",
  description: `ZotMeal: A dynamic web app to discover everything UCI's dining 
                halls have to offer - from daily menus and special events to 
                dining hall features and updates.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
}
