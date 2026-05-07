import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Mentions Légales | NextUnicorn",
  description: "Mentions légales de NextUnicorn.",
  alternates: {
    canonical: absoluteUrl('/mentions'),
  },
  openGraph: {
    title: "Mentions Légales | NextUnicorn",
    description: "Mentions légales de NextUnicorn.",
    url: absoluteUrl('/mentions'),
    type: "article",
  },
};

export default function MentionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
