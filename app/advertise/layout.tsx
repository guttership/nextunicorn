import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Advertise on NextUnicorn - Reach SaaS Founders and Developers",
  description: "Promote your SaaS to founders and developers discovering validated startup ideas on NextUnicorn.",
  alternates: {
    canonical: absoluteUrl('/advertise'),
  },
  openGraph: {
    title: "Advertise on NextUnicorn",
    description: "Promote your SaaS to founders and developers discovering validated startup ideas on NextUnicorn.",
    url: absoluteUrl('/advertise'),
    type: "website",
  },
};

export default function AdvertiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
