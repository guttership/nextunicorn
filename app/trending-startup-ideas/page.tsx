import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";
import { absoluteUrl } from "@/app/lib/seo";

const slug = "trending-startup-ideas";

export const metadata: Metadata = {
  title: "Trending Startup Ideas Right Now | NextUnicorn",
  description: "Discover trending startup ideas with strong momentum from community voting and engagement signals.",
  alternates: {
    canonical: absoluteUrl('/trending-startup-ideas'),
  },
  openGraph: {
    title: "Trending Startup Ideas Right Now | NextUnicorn",
    description: "Discover trending startup ideas with strong momentum from community voting and engagement signals.",
    url: absoluteUrl('/trending-startup-ideas'),
    siteName: "NextUnicorn",
    type: "website",
    images: [
      {
        url: absoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: "Trending startup ideas on NextUnicorn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Startup Ideas Right Now | NextUnicorn",
    description: "Discover trending startup ideas with strong momentum from community voting and engagement signals.",
    images: [absoluteUrl('/og-image.png')],
  },
};

export default async function TrendingStartupIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}