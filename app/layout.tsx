import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Flow",
  description: "Learn anything with AI generated knowledge roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <a href='https://cloud.mongodb.com/v2/68f224c7777084438f6148e4#/metrics/replicaSet/68f224f97e890959670e0f86/explorer/prod/lessons/find'>MongoDB</a>
        {children}
      </body>
    </html>
  );
}
