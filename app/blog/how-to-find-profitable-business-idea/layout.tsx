import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/blog/how-to-find-profitable-business-idea'),
  },
  openGraph: {
    url: absoluteUrl('/blog/how-to-find-profitable-business-idea'),
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
