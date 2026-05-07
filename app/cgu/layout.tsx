import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | NextUnicorn",
  description: "Conditions générales d'utilisation de la plateforme NextUnicorn.",
  alternates: {
    canonical: absoluteUrl('/cgu'),
  },
  openGraph: {
    title: "Conditions Générales d'Utilisation | NextUnicorn",
    description: "Conditions générales d'utilisation de la plateforme NextUnicorn.",
    url: absoluteUrl('/cgu'),
    type: "article",
  },
};

export default function CguLayout({ children }: { children: React.ReactNode }) {
  return children;
}
