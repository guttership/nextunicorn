import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/blog/50-saas-ideas-developers-2025'),
  },
  openGraph: {
    url: absoluteUrl('/blog/50-saas-ideas-developers-2025'),
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
