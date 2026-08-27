import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const editorial = Cormorant_Garamond({ variable: "--font-editorial", subsets: ["latin"], display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gareth64.vercel.app"),
  title: "Gareth Beall — Lead AI/ML Engineer",
  description: "An immersive Gareth64 résumé: clinical judgment, production AI engineering, IRIS, and independent products.",
  applicationName: "Gareth64",
  authors: [{ name: "Gareth Beall", url: "https://inkyhealth.com/work" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Gareth Beall — Lead AI/ML Engineer",
    description: "Clinical judgment × production AI, loaded from an original retro computer.",
    type: "website",
    url: "/",
    siteName: "Gareth64",
  },
  twitter: { card: "summary_large_image", title: "Gareth64", description: "An immersive résumé for AI/ML engineer Gareth Beall." },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}>
      <body><a className="skip-link" href="#main-content">Skip to content</a>{children}<Analytics /></body>
    </html>
  );
}
