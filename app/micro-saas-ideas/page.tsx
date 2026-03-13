import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";

const slug = "micro-saas-ideas";

export const metadata: Metadata = {
  title: "Micro SaaS Ideas to Explore and Build | NextUnicorn",
  description: "Discover bootstrappable micro SaaS ideas with clear pain points, practical MVP scope, and real community demand signals.",
  alternates: {
    canonical: "https://nextunicorn.app/micro-saas-ideas",
  },
};

export default async function MicroSaasIdeasPage() {
  const data = await getSeoIdeasForHub(slug);

  if (!data) {
    notFound();
  }

  return <SeoIdeaHubPage {...data} />;
}