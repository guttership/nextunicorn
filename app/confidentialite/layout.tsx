import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | NextUnicorn",
  description: "Politique de confidentialité de NextUnicorn.",
  alternates: {
    canonical: absoluteUrl('/confidentialite'),
  },
  openGraph: {
    title: "Politique de Confidentialité | NextUnicorn",
    description: "Politique de confidentialité de NextUnicorn.",
    url: absoluteUrl('/confidentialite'),
    type: "article",
  },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
