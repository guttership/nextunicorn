import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/blog/50-idees-saas-developpeurs-2025'),
  },
  openGraph: {
    url: absoluteUrl('/blog/50-idees-saas-developpeurs-2025'),
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
