import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Ad Payment Success | NextUnicorn",
  description: "Confirmation page after ad payment.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: absoluteUrl('/advertise/success'),
  },
};

export default function AdvertiseSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
