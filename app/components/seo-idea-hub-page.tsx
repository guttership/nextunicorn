import Link from "next/link";

import { buildIdeaSlug } from "@/app/lib/idea-slugs";
import type { SeoIdeaCard, SeoIdeaHubConfig } from "@/app/lib/seo-idea-hubs";

type SeoIdeaHubPageProps = {
  hub: SeoIdeaHubConfig;
  ideas: SeoIdeaCard[];
  latestIdeas: SeoIdeaCard[];
  trendingIdeas: SeoIdeaCard[];
  relatedHubs: SeoIdeaHubConfig[];
};

function formatWinRate(winRate: number) {
  return `${Math.round(winRate * 100)}%`;
}

function IdeaListCard({ idea }: { idea: SeoIdeaCard }) {
  const detailHref = `/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`;

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-pink-600">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">
            <Link href={detailHref} className="hover:text-pink-400">
              {idea.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm font-mono text-slate-400">{idea.slogan}</p>
        </div>
        <span className="rounded bg-slate-800 px-2 py-1 text-xs font-mono text-pink-400">
          {idea.status}
        </span>
      </div>
      <p className="mb-4 text-sm leading-7 text-slate-300">{idea.description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {idea.categoryTags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-xs font-mono text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
        <span>{idea.totalVotes} votes</span>
        <span>{formatWinRate(idea.winRate)} win rate</span>
        <span>{idea.score} wins</span>
      </div>
      <div className="mt-4">
        <Link href={detailHref} className="text-sm font-mono text-pink-400 hover:text-pink-300">
          View full startup idea analysis
        </Link>
      </div>
    </article>
  );
}

function SidebarList({ title, items }: { title: string; items: SeoIdeaCard[] }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.2em] text-pink-500">{title}</h2>
      <div className="space-y-4">
        {items.map((idea) => (
          <article key={`${title}-${idea.id}`}>
            <Link
              href={`/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`}
              className="text-sm font-semibold text-slate-100 hover:text-pink-400"
            >
              {idea.title}
            </Link>
            <p className="mt-1 text-sm leading-6 text-slate-400">{idea.slogan}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SeoIdeaHubPage({ hub, ideas, latestIdeas, trendingIdeas, relatedHubs }: SeoIdeaHubPageProps) {
  const baseUrl = "https://nextunicorn.app";
  const itemListElements = ideas.slice(0, 20).map((idea, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`,
    name: idea.title,
  }));

  const hubJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.description,
    url: `${baseUrl}/${hub.slug}`,
    about: hub.keywords,
    hasPart: {
      "@type": "ItemList",
      itemListElement: itemListElements,
    },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 md:p-10">
          <div className="mb-4 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.2em] text-pink-500">
            <span>NextUnicorn</span>
            <span>SEO Hub</span>
            <span>{hub.title}</span>
          </div>
          <h1 className="max-w-4xl text-3xl font-black text-slate-100 md:text-5xl" style={{ fontFamily: "var(--font-clicker)" }}>
            {hub.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">{hub.description}</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">{hub.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded bg-pink-600 px-4 py-2 text-sm font-mono font-bold text-white transition-colors hover:bg-pink-700">
              Start voting
            </Link>
            <Link href="/leaderboard" className="rounded border border-slate-700 px-4 py-2 text-sm font-mono font-bold text-slate-200 transition-colors hover:border-pink-600 hover:text-white">
              Explore ranked ideas
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100 md:text-2xl">Ideas in this cluster</h2>
                <p className="mt-2 text-sm text-slate-400">Focused ideas selected from the active and archived catalogue.</p>
              </div>
              <span className="rounded bg-slate-900 px-3 py-2 text-xs font-mono text-slate-400">
                {ideas.length} ideas
              </span>
            </div>

            {ideas.length > 0 ? (
              <div className="grid gap-6">
                {ideas.map((idea) => (
                  <IdeaListCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-8 text-sm leading-7 text-slate-400">
                {hub.emptyMessage}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <SidebarList title="Trending ideas" items={trendingIdeas} />
            <SidebarList title="Latest ideas" items={latestIdeas} />

            <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.2em] text-pink-500">Related hubs</h2>
              <div className="space-y-3">
                {relatedHubs.map((relatedHub) => (
                  <Link
                    key={relatedHub.slug}
                    href={`/${relatedHub.slug}`}
                    className="block rounded border border-slate-800 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-pink-600 hover:text-white"
                  >
                    <div className="font-semibold text-slate-100">{relatedHub.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{relatedHub.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }} />
    </main>
  );
}