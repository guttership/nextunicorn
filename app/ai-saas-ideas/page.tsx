import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";

const slug = "ai-saas-ideas";

export const metadata: Metadata = {
  title: "AI SaaS Ideas for Founders and Builders | NextUnicorn",
  description: "Explore AI SaaS ideas for automation, productivity, and business workflows, ranked with community voting signals.",
  alternates: {
    canonical: "https://nextunicorn.app/ai-saas-ideas",
  },
};

export default async function AiSaasIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}