import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Admin | NextUnicorn",
  description: "Administrative area.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: absoluteUrl('/admin'),
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
