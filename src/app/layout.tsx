import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrackLet - Personal Account Usage Tracker",
  description: "Personal monthly usage tracker for Gmail and GitHub account pairs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans text-neutral-900 bg-[#f1f3f5] text-sm antialiased">
        {children}
      </body>
    </html>
  );
}
