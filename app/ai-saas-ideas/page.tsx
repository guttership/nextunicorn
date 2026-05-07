import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";
import { absoluteUrl } from "@/app/lib/seo";

const slug = "ai-saas-ideas";

export const metadata: Metadata = {
  title: "AI SaaS Ideas for Founders and Builders | NextUnicorn",
  description: "Explore AI SaaS ideas for automation, productivity, and business workflows, ranked with community voting signals.",
  alternates: {
    canonical: absoluteUrl('/ai-saas-ideas'),
  },
  openGraph: {
    title: "AI SaaS Ideas for Founders and Builders | NextUnicorn",
    description: "Explore AI SaaS ideas for automation, productivity, and business workflows, ranked with community voting signals.",
    url: absoluteUrl('/ai-saas-ideas'),
    siteName: "NextUnicorn",
    type: "website",
    images: [
      {
        url: absoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: "AI SaaS ideas on NextUnicorn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI SaaS Ideas for Founders and Builders | NextUnicorn",
    description: "Explore AI SaaS ideas for automation, productivity, and business workflows, ranked with community voting signals.",
    images: [absoluteUrl('/og-image.png')],
  },
};

export default async function AiSaasIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}