import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";

const slug = "trending-startup-ideas";

export const metadata: Metadata = {
  title: "Trending Startup Ideas Right Now | NextUnicorn",
  description: "Discover trending startup ideas with strong momentum from community voting and engagement signals.",
  alternates: {
    canonical: "https://nextunicorn.app/trending-startup-ideas",
  },
};

export default async function TrendingStartupIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}