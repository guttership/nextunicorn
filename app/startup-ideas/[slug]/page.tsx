import type { Metadata } from "next";
import { IdeaStatus } from "@prisma/client";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { prisma } from "@/app/lib/db/prisma";
import { buildIdeaSlug, parseIdeaIdFromSlug } from "@/app/lib/idea-slugs";
import { absoluteUrl } from "@/app/lib/seo";
import IdeaShareActions from "@/app/components/idea-share-actions";

type IdeaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function toLabel(tag: string) {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function ideaSummary(idea: { title: string; slogan: string; description: string }) {
  return `${idea.title} is a startup idea focused on ${idea.slogan.toLowerCase()}. ${idea.description}`;
}

function statusLabel(status: IdeaStatus) {
  switch (status) {
    case IdeaStatus.TRENDING:
      return "Trending";
    case IdeaStatus.ARCHIVED:
      return "Archived";
    case IdeaStatus.UNPOPULAR:
      return "Unpopular";
    default:
      return "Active";
  }
}

async function getIdeaBySlug(slug: string) {
  const id = parseIdeaIdFromSlug(slug);
  if (!id) {
    return null;
  }

  const idea = await prisma.idea.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slogan: true,
      description: true,
      aiPrompt: true,
      audience: true,
      categoryTags: true,
      totalVotes: true,
      winCount: true,
      lossCount: true,
      winRate: true,
      rankingScore: true,
      trendScore: true,
      status: true,
      createdAt: true,
      generatedAt: true,
      isReserved: true,
    },
  });

  return idea;
}

async function getRelatedIdeas(ideaId: number, tags: string[]) {
  const relatedByTags = tags.length > 0
    ? await prisma.idea.findMany({
        where: {
          id: { not: ideaId },
          isReserved: false,
          status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
          categoryTags: { hasSome: tags },
        },
        select: {
          id: true,
          title: true,
          slogan: true,
          rankingScore: true,
        },
        orderBy: [{ rankingScore: "desc" }, { createdAt: "desc" }],
        take: 6,
      })
    : [];

  if (relatedByTags.length >= 6) {
    return relatedByTags;
  }

  const fallbackIdeas = await prisma.idea.findMany({
    where: {
      id: { notIn: [ideaId, ...relatedByTags.map((item) => item.id)] },
      isReserved: false,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
    },
    select: {
      id: true,
      title: true,
      slogan: true,
      rankingScore: true,
    },
    orderBy: [{ rankingScore: "desc" }, { createdAt: "desc" }],
    take: 6 - relatedByTags.length,
  });

  return [...relatedByTags, ...fallbackIdeas];
}

export async function generateMetadata({ params }: IdeaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);

  if (!idea || idea.isReserved) {
    return {
      title: "Startup Idea Not Found | NextUnicorn",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalSlug = buildIdeaSlug({ id: idea.id, title: idea.title });
  const title = `${idea.title} — SaaS Startup Idea | NextUnicorn`;
  const description = `${idea.slogan} Explore this startup idea, target users, market opportunity, business model, and live community votes on NextUnicorn.`;

  return {
    title,
    description,
    keywords: [
      "startup idea",
      "saas startup idea",
      "micro saas",
      "business idea for developers",
      ...idea.categoryTags,
    ],
    alternates: {
      canonical: absoluteUrl(`/startup-ideas/${canonicalSlug}`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/startup-ideas/${canonicalSlug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const ideas = await prisma.idea.findMany({
    where: {
      isReserved: false,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: [{ rankingScore: "desc" }, { createdAt: "desc" }],
    take: 500,
  });

  return ideas.map((idea) => ({
    slug: buildIdeaSlug({ id: idea.id, title: idea.title }),
  }));
}

export default async function StartupIdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);

  if (!idea || idea.isReserved) {
    notFound();
  }

  const canonicalSlug = buildIdeaSlug({ id: idea.id, title: idea.title });
  if (slug !== canonicalSlug) {
    permanentRedirect(`/startup-ideas/${canonicalSlug}`);
  }
  const relatedIdeas = await getRelatedIdeas(idea.id, idea.categoryTags);
  const targetUsers = idea.audience?.trim() || "Founders, operators, and developers looking for a focused SaaS opportunity.";
  const tags = idea.categoryTags.length > 0 ? idea.categoryTags : ["startup", "saas"];
  const keywordLine = tags.map(toLabel).join(", ");
  const roundedWinRate = `${Math.round(idea.winRate * 100)}%`;
  const status = statusLabel(idea.status);
  const canonicalUrl = absoluteUrl(`/startup-ideas/${canonicalSlug}`);
  const copyablePitch = `${idea.title} helps teams solve operational bottlenecks around ${keywordLine.toLowerCase()} with a focused SaaS workflow that reduces manual effort and improves consistency.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startup Ideas",
          item: absoluteUrl('/startup-ideas'),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: idea.title,
          item: canonicalUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: idea.title,
      description: ideaSummary(idea),
      creator: {
        "@type": "Organization",
        name: "NextUnicorn AI",
      },
      datePublished: idea.generatedAt.toISOString(),
      keywords: tags,
      url: canonicalUrl,
    },
    {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: idea.title,
    description: ideaSummary(idea),
    author: {
      "@type": "Organization",
      name: "NextUnicorn AI",
    },
    datePublished: idea.generatedAt.toISOString(),
    dateModified: idea.createdAt.toISOString(),
    keywords: tags,
    mainEntityOfPage: canonicalUrl,
    about: tags.map(toLabel),
  },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <nav className="mb-8 text-sm font-mono text-slate-400">
          <Link href="/startup-ideas" className="hover:text-slate-100">Startup Ideas</Link>
          <span className="px-2">/</span>
          <span className="text-slate-200">{idea.title}</span>
        </nav>

        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-pink-500">SaaS Startup Idea</p>
          <h1 className="text-3xl font-black md:text-5xl" style={{ fontFamily: "var(--font-clicker)" }}>{idea.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-200">{idea.slogan}</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">{idea.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-xs font-mono text-slate-300">{toLabel(tag)}</span>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-mono uppercase text-slate-400">Community status</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{status}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-mono uppercase text-slate-400">Total votes</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{idea.totalVotes}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-mono uppercase text-slate-400">Win rate</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{roundedWinRate}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-mono uppercase text-slate-400">Wins / Losses</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{idea.winCount} / {idea.lossCount}</p>
          </div>
        </section>

        <article className="mt-8 space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 leading-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Short Summary</h2>
            <p className="mt-3">{ideaSummary(idea)}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">The Problem This Idea Solves</h2>
            <p className="mt-3">{idea.description} This concept targets repeatable operational friction where teams lose time, consistency, or revenue because existing workflows are fragmented.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Target Users</h2>
            <p className="mt-3">{targetUsers}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Why This Idea Might Work</h2>
            <p className="mt-3">The idea sits at the intersection of clear pain, actionable workflow improvements, and measurable value. It can be positioned as a focused SaaS offer with fast onboarding and immediate ROI for teams that currently use manual workarounds.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Possible Features</h2>
            <h3 className="mt-3 text-lg font-semibold text-slate-100">MVP Features</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Core workflow to solve the primary user pain in one flow</li>
              <li>Simple dashboard with history, status, and key metrics</li>
              <li>User and role management for small teams</li>
              <li>Export and sharing options for stakeholder visibility</li>
            </ul>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">Later Iterations</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Automations and alerts based on activity patterns</li>
              <li>Integrations with existing tools used by the target market</li>
              <li>AI-assisted recommendations when relevant</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Business Model</h2>
            <p className="mt-3">A practical model is subscription pricing with 2-3 tiers based on usage or team size. Start with a low-friction entry tier for fast adoption, then expand ARPU through premium automation and integrations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Market Opportunity</h2>
            <p className="mt-3">This idea aligns with demand for specialized software that replaces spreadsheets and ad-hoc processes. The strongest opportunity is to win a focused niche first, then expand into adjacent workflows once retention and product-market fit are proven.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Possible Technical Stack</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Frontend: Next.js with server rendering for SEO pages</li>
              <li>Backend: API routes with typed validation and audit logs</li>
              <li>Database: PostgreSQL with Prisma ORM</li>
              <li>Auth and billing: session-based auth plus Stripe subscriptions</li>
              <li>Observability: analytics events for activation and retention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Similar Products or Competitors</h2>
            <p className="mt-3">Potential competitors vary by niche, from broad SMB tools to specialized vertical SaaS products. Positioning should focus on faster setup, narrower workflow fit, and better usability for the exact user profile this idea targets.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Community Vote Statistics</h2>
            <p className="mt-3">This idea currently has {idea.totalVotes} total votes, with {idea.winCount} wins and {idea.lossCount} losses, resulting in a {roundedWinRate} win rate. These signals help compare traction against other startup concepts in the catalogue.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Build This Idea</h2>
            <p className="mt-3">If you want to build this, start with a narrow MVP that addresses one high-friction scenario and one target user profile. Validate onboarding, activation, and willingness to pay before broadening scope.</p>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-mono text-slate-400">Copyable startup pitch</p>
              <p className="mt-2 text-sm text-slate-200">{copyablePitch}</p>
            </div>
            <IdeaShareActions ideaTitle={idea.title} canonicalUrl={canonicalUrl} pitch={copyablePitch} />
            {process.env.NEXT_PUBLIC_GITHUB_STARTER_URL ? (
              <div className="mt-3">
                <a
                  href={process.env.NEXT_PUBLIC_GITHUB_STARTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-pink-400 hover:text-pink-300"
                >
                  Open GitHub starter template
                </a>
              </div>
            ) : null}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100">Next Steps</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/" className="rounded bg-pink-600 px-4 py-2 text-sm font-mono font-bold text-white hover:bg-pink-700">Vote on this idea</Link>
              <Link href="/startup-ideas" className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 hover:border-pink-600 hover:text-white">Explore more startup ideas</Link>
              <Link href="/trending-startup-ideas" className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 hover:border-pink-600 hover:text-white">See trending ideas</Link>
            </div>
          </section>
        </article>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-semibold text-slate-100">Related Startup Ideas</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedIdeas.map((related) => (
              <Link
                key={related.id}
                href={`/startup-ideas/${buildIdeaSlug({ id: related.id, title: related.title })}`}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-pink-600"
              >
                <h3 className="text-lg font-semibold text-slate-100">{related.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{related.slogan}</p>
              </Link>
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </main>
  );
}