import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/blog/comment-trouver-idee-business-profitable'),
  },
  openGraph: {
    url: absoluteUrl('/blog/comment-trouver-idee-business-profitable'),
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
