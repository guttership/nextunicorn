import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";
import { absoluteUrl } from "@/app/lib/seo";

const slug = "micro-saas-ideas";

export const metadata: Metadata = {
  title: "Micro SaaS Ideas to Explore and Build | NextUnicorn",
  description: "Discover bootstrappable micro SaaS ideas with clear pain points, practical MVP scope, and real community demand signals.",
  alternates: {
    canonical: absoluteUrl('/micro-saas-ideas'),
  },
  openGraph: {
    title: "Micro SaaS Ideas to Explore and Build | NextUnicorn",
    description: "Discover bootstrappable micro SaaS ideas with clear pain points, practical MVP scope, and real community demand signals.",
    url: absoluteUrl('/micro-saas-ideas'),
    siteName: "NextUnicorn",
    type: "website",
    images: [
      {
        url: absoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: "Micro SaaS ideas on NextUnicorn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Micro SaaS Ideas to Explore and Build | NextUnicorn",
    description: "Discover bootstrappable micro SaaS ideas with clear pain points, practical MVP scope, and real community demand signals.",
    images: [absoluteUrl('/og-image.png')],
  },
};

export default async function MicroSaasIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}