import type { Metadata } from "next";

import { QuickView } from "@/components/QuickView";

export const metadata: Metadata = {
  title: "Résumé — Gareth Beall",
  description: "Print-friendly résumé for Gareth Beall, Lead AI/ML Engineer.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return <main id="main-content"><QuickView compact /></main>;
}
