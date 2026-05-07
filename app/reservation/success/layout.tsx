import type { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Reservation Success | NextUnicorn",
  description: "Confirmation page after idea reservation.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: absoluteUrl('/reservation/success'),
  },
};

export default function ReservationSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
