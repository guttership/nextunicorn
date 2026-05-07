import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions | NextUnicorn",
  description: "Terms and conditions for advertising services and platform usage on NextUnicorn.",
  alternates: {
    canonical: absoluteUrl('/terms'),
  },
  openGraph: {
    title: "Terms and Conditions | NextUnicorn",
    description: "Terms and conditions for advertising services and platform usage on NextUnicorn.",
    url: absoluteUrl('/terms'),
    type: "article",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
