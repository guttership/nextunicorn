import { IdeaStatus } from "@prisma/client";

import { prisma } from "@/app/lib/db/prisma";

export type SeoIdeaCard = {
  id: number;
  title: string;
  slogan: string;
  description: string;
  score: number;
  totalVotes: number;
  winRate: number;
  rankingScore: number;
  trendScore: number;
  categoryTags: string[];
  createdAt: Date;
  status: IdeaStatus;
};

export type SeoIdeaHubConfig = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  emptyMessage: string;
  match: (idea: SeoIdeaCard) => boolean;
};

const MICRO_SAAS_TAGS = new Set([
  "b2b-automation",
  "developer-tools",
  "analytics",
  "vertical-saas",
  "sales-marketing",
  "ecommerce",
  "hr-ops",
  "fintech",
]);

function normalizeText(value: string) {
  return value.toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsKeyword(haystack: string, term: string) {
  const normalizedTerm = normalizeText(term).trim();
  if (!normalizedTerm) {
    return false;
  }

  if (normalizedTerm.includes(" ") || normalizedTerm.includes("-")) {
    return haystack.includes(normalizedTerm);
  }

  return new RegExp(`\\b${escapeRegExp(normalizedTerm)}\\b`, "i").test(haystack);
}

function matchesText(idea: SeoIdeaCard, terms: string[]) {
  const haystack = normalizeText([
    idea.title,
    idea.slogan,
    idea.description,
    idea.categoryTags.join(" "),
  ].join(" "));

  return terms.some((term) => containsKeyword(haystack, term));
}

function matchesVisibleText(idea: SeoIdeaCard, terms: string[]) {
  const haystack = normalizeText([
    idea.title,
    idea.slogan,
    idea.description,
  ].join(" "));

  return terms.some((term) => containsKeyword(haystack, term));
}

function isMicroSaasIdea(idea: SeoIdeaCard) {
  if (idea.categoryTags.some((tag) => MICRO_SAAS_TAGS.has(tag))) {
    return true;
  }

  return matchesText(idea, [
    "micro saas",
    "micro-saas",
    "solo founder",
    "small team",
    "automation",
    "workflow",
    "dashboard",
    "developer",
  ]);
}

function isAiSaasIdea(idea: SeoIdeaCard) {
  return matchesVisibleText(idea, [
    "ai",
    "assistant",
    "copilot",
    "llm",
    "machine learning",
    "summarize",
    "ai-powered",
    "ai powered",
    "smart suggestions",
  ]);
}

function isDeveloperIdea(idea: SeoIdeaCard) {
  return idea.categoryTags.includes("developer-tools") || matchesText(idea, [
    "developer",
    "developers",
    "sdk",
    "api",
    "devops",
    "deploy",
    "debug",
    "engineering",
    "code",
  ]);
}

export const seoIdeaHubs: SeoIdeaHubConfig[] = [
  {
    slug: "startup-ideas",
    title: "Startup Ideas",
    description: "Explore startup and micro SaaS ideas ranked by community interest, with practical concepts builders can turn into products.",
    intro: "This is the main discovery hub for startup ideas on NextUnicorn. It combines active and archived ideas so founders and developers can browse high-signal opportunities, compare patterns, and find practical concepts to build.",
    seoTitle: "Startup Ideas Database for Founders and Developers | NextUnicorn",
    metaDescription: "Browse startup ideas, micro SaaS concepts, and developer-focused opportunities ranked by community voting and engagement signals.",
    keywords: ["startup ideas", "saas startup ideas", "profitable startup ideas", "business ideas for developers"],
    emptyMessage: "No startup ideas are available yet. Generate ideas or vote to start building this public database.",
    match: () => true,
  },
  {
    slug: "trending-startup-ideas",
    title: "Trending Startup Ideas",
    description: "Discover startup ideas with the strongest current momentum based on votes, engagement, and trend score.",
    intro: "This page highlights ideas with recent traction. Use it to spot what builders are actively engaging with right now, while still keeping access to the broader startup idea catalogue.",
    seoTitle: "Trending Startup Ideas Right Now | NextUnicorn",
    metaDescription: "See trending startup ideas ranked by community signals. Discover rising SaaS concepts with momentum.",
    keywords: ["trending startup ideas", "hot saas ideas", "startup trends", "popular startup ideas"],
    emptyMessage: "No ideas are trending yet. As more votes come in, this page will surface rising startup concepts.",
    match: (idea) => idea.status === IdeaStatus.TRENDING || idea.trendScore > 0.5,
  },
  {
    slug: "micro-saas-ideas",
    title: "Micro SaaS Ideas",
    description: "Explore bootstrappable micro SaaS ideas with clear pain points, practical MVP scope, and community demand signals.",
    intro: "Browse micro SaaS ideas you can realistically build as a solo founder or small team. These concepts are filtered to emphasize focused scope, clear monetization, and pain points that map well to fast MVP execution.",
    seoTitle: "Micro SaaS Ideas to Explore and Build | NextUnicorn",
    metaDescription: "Discover micro SaaS ideas with practical use cases, clear target users, and community voting signals. Explore bootstrappable ideas on NextUnicorn.",
    keywords: ["micro saas ideas", "bootstrapped saas ideas", "solo founder ideas", "saas ideas"],
    emptyMessage: "No micro SaaS ideas are available yet. Generate or vote on more ideas to enrich this page.",
    match: (idea) => isMicroSaasIdea(idea),
  },
  {
    slug: "ai-saas-ideas",
    title: "AI SaaS Ideas",
    description: "Discover AI SaaS ideas focused on productivity, workflow automation, and software opportunities with stronger community traction.",
    intro: "This page groups AI SaaS ideas that use automation, assistants, copilots, or workflow intelligence to solve a specific business problem. It is designed for builders looking for AI opportunities with clearer product direction than generic chatbot concepts.",
    seoTitle: "AI SaaS Ideas for Founders and Builders | NextUnicorn",
    metaDescription: "Explore AI SaaS ideas ranked by community voting. Find practical AI startup opportunities for automation, productivity, and business workflows.",
    keywords: ["ai saas ideas", "ai startup ideas", "ai business ideas", "saas ideas with ai"],
    emptyMessage: "No AI SaaS ideas match the current catalogue yet. Generate more ideas or let the community vote to expand this cluster.",
    match: (idea) => isAiSaasIdea(idea),
  },
  {
    slug: "micro-saas-ideas-for-developers",
    title: "Micro SaaS Ideas for Developers",
    description: "Find micro SaaS ideas for developers, indie hackers, and technical founders looking for practical products to build.",
    intro: "These ideas are tailored to developers who want product concepts with technical leverage: APIs, internal tools, dev workflows, debugging, deployment, and operational automation. The focus stays on smaller SaaS opportunities with realistic build scope.",
    seoTitle: "Micro SaaS Ideas for Developers | NextUnicorn",
    metaDescription: "Explore micro SaaS ideas for developers, from dev tools to workflow automation. Discover technical product ideas validated by community voting.",
    keywords: ["micro saas ideas for developers", "developer startup ideas", "dev tool ideas", "indie hacker ideas"],
    emptyMessage: "No developer-focused micro SaaS ideas are available yet. Vote on more ideas to strengthen this cluster.",
    match: (idea) => isMicroSaasIdea(idea) && isDeveloperIdea(idea),
  },
];

export function getSeoIdeaHub(slug: string) {
  return seoIdeaHubs.find((hub) => hub.slug === slug) ?? null;
}

export async function getSeoIdeasForHub(slug: string, limit = 24) {
  const hub = getSeoIdeaHub(slug);
  if (!hub) {
    return null;
  }

  let ideas = await prisma.idea.findMany({
    where: {
      isReserved: false,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
    },
    select: {
      id: true,
      title: true,
      slogan: true,
      description: true,
      score: true,
      totalVotes: true,
      winRate: true,
      rankingScore: true,
      trendScore: true,
      categoryTags: true,
      createdAt: true,
      status: true,
    },
    orderBy: [
      { rankingScore: "desc" },
      { trendScore: "desc" },
      { createdAt: "desc" },
    ],
    take: 200,
  });

  if (slug === "trending-startup-ideas") {
    ideas = [...ideas].sort((a, b) => {
      if (b.trendScore !== a.trendScore) {
        return b.trendScore - a.trendScore;
      }
      if (b.totalVotes !== a.totalVotes) {
        return b.totalVotes - a.totalVotes;
      }
      return b.rankingScore - a.rankingScore;
    });
  }

  let filteredIdeas = ideas.filter(hub.match);

  if (slug === "micro-saas-ideas-for-developers" && filteredIdeas.length === 0) {
    filteredIdeas = ideas.filter((idea) => isDeveloperIdea(idea) || matchesText(idea, ["automation", "workflow", "internal tool"]));
  }

  if (slug === "trending-startup-ideas" && filteredIdeas.length === 0) {
    filteredIdeas = ideas.slice(0, Math.min(limit, 12));
  }

  filteredIdeas = filteredIdeas.slice(0, limit);
  const latestIdeas = ideas.slice(0, 6);
  const trendingIdeas = ideas.filter((idea) => idea.status === IdeaStatus.TRENDING).slice(0, 6);
  const relatedHubs = seoIdeaHubs.filter((candidate) => candidate.slug !== slug).slice(0, 3);

  return {
    hub,
    ideas: filteredIdeas,
    latestIdeas,
    trendingIdeas,
    relatedHubs,
  };
}