import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const editorial = Cormorant_Garamond({ variable: "--font-editorial", subsets: ["latin"], display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://garethbeall.com"),
  title: "Gareth Beall, Lead AI/ML Engineer",
  description: "Gareth Beall's resume, running as a playable Commodore 64. Clinical AI engineering, IRIS, and shipped products.",
  applicationName: "Gareth64",
  authors: [{ name: "Gareth Beall", url: "https://github.com/gazb23" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Gareth Beall, Lead AI/ML Engineer",
    description: "A resume you can play. Boot the machine, load a tape, ask the AI anything.",
    type: "website",
    url: "/",
    siteName: "Gareth64",
  },
  twitter: { card: "summary_large_image", title: "Gareth64", description: "Gareth Beall's resume, running on a Commodore 64." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080b0a" },
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}>
      <body><a className="skip-link" href="#main-content">Skip to content</a>{children}<Analytics /></body>
    </html>
  );
}
