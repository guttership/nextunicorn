import type { Metadata } from "next";
import { IdeaStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import SeoIdeaHubPage from "@/app/components/seo-idea-hub-page";
import { prisma } from "@/app/lib/db/prisma";
import { buildIdeaSlug } from "@/app/lib/idea-slugs";
import { getSeoIdeasForHub } from "@/app/lib/seo-idea-hubs";
import { absoluteUrl } from "@/app/lib/seo";

const slug = "startup-ideas";

export const metadata: Metadata = {
  title: "Startup Ideas Database for Founders and Developers | NextUnicorn",
  description: "Browse startup ideas, micro SaaS concepts, and developer-focused opportunities ranked by community voting and engagement signals.",
  alternates: {
    canonical: absoluteUrl('/startup-ideas'),
  },
  openGraph: {
    title: "Startup Ideas Database for Founders and Developers | NextUnicorn",
    description: "Browse startup ideas, micro SaaS concepts, and developer-focused opportunities ranked by community voting and engagement signals.",
    url: absoluteUrl('/startup-ideas'),
    siteName: "NextUnicorn",
    type: "website",
    images: [
      {
        url: absoluteUrl('/og-image.png'),
        width: 1200,
        height: 630,
        alt: "NextUnicorn startup ideas catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Ideas Database for Founders and Developers | NextUnicorn",
    description: "Browse startup ideas, micro SaaS concepts, and developer-focused opportunities ranked by community voting and engagement signals.",
    images: [absoluteUrl('/og-image.png')],
  },
};

export default async function StartupIdeasPage() {
  const [data, crawlableIdeas] = await Promise.all([
    getSeoIdeasForHub(slug),
    prisma.idea.findMany({
      where: {
        isReserved: false,
        status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: [{ rankingScore: "desc" }, { createdAt: "desc" }],
      take: 1200,
    }),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <SeoIdeaHubPage {...data} />
      <nav aria-label="Crawlable startup ideas index" className="sr-only" data-seo="crawl-links">
        <h2>All startup ideas</h2>
        <ul>
          {crawlableIdeas.map((idea) => (
            <li key={idea.id}>
              <Link href={`/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`}>
                {idea.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}