import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";

const slug = "micro-saas-ideas-for-developers";

export const metadata: Metadata = {
  title: "Micro SaaS Ideas for Developers | NextUnicorn",
  description: "Find micro SaaS ideas for developers, indie hackers, and technical founders, from dev tools to workflow automation.",
  alternates: {
    canonical: "https://nextunicorn.app/micro-saas-ideas-for-developers",
  },
};

export default async function MicroSaasIdeasForDevelopersPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}