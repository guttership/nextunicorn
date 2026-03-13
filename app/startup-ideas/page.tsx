import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";

const slug = "startup-ideas";

export const metadata: Metadata = {
  title: "Startup Ideas Database for Founders and Developers | NextUnicorn",
  description: "Browse startup ideas, micro SaaS concepts, and developer-focused opportunities ranked by community voting and engagement signals.",
  alternates: {
    canonical: "https://nextunicorn.app/startup-ideas",
  },
};

export default async function StartupIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}