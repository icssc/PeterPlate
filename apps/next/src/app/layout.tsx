import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { RootClient } from './layout-client';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZotMeal",
  description: `ZotMeal: A dynamic web app to discover everything UCI's dining 
                halls have to offer – from daily menus and special events to 
                dining hall features and updates.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootClient>
          {children}
        </RootClient>
      </body>
    </html>
  );
}
