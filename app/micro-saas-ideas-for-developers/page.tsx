import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";
import { absoluteUrl } from "@/app/lib/seo";

const slug = "micro-saas-ideas-for-developers";

export const metadata: Metadata = {
  title: "Micro SaaS Ideas for Developers | NextUnicorn",
  description: "Find micro SaaS ideas for developers, indie hackers, and technical founders, from dev tools to workflow automation.",
  alternates: {
    canonical: absoluteUrl('/micro-saas-ideas-for-developers'),
  },
  openGraph: {
    title: "Micro SaaS Ideas for Developers | NextUnicorn",
    description: "Find micro SaaS ideas for developers, indie hackers, and technical founders, from dev tools to workflow automation.",
    url: absoluteUrl('/micro-saas-ideas-for-developers'),
    siteName: "NextUnicorn",
    type: "website",
    images: [
      {
        url: absoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: "Micro SaaS ideas for developers on NextUnicorn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Micro SaaS Ideas for Developers | NextUnicorn",
    description: "Find micro SaaS ideas for developers, indie hackers, and technical founders, from dev tools to workflow automation.",
    images: [absoluteUrl('/og-image.png')],
  },
};

export default async function MicroSaasIdeasForDevelopersPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}