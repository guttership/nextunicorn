import { IdeaStatus, PromptProfile } from "@prisma/client";

import { prisma } from "@/app/lib/db/prisma";

export const IDEA_ACTIVE_DAYS = 15;
export const OUTSIDER_EXPOSURE_THRESHOLD = 5;
export const OUTSIDER_VOTE_THRESHOLD = 3;

const TRENDING_MIN_VOTES = 5;
const TRENDING_MIN_WIN_RATE = 0.6;
const TRENDING_STALE_HOURS = 48;
const IGNORED_EXPOSURE_THRESHOLD = 10;

const BASE_GENERATION_INSTRUCTION = [
  "Generate profitable SaaS startup ideas with a sharp pain point, clear target user, and realistic monetization.",
  "Prioritize ideas that are understandable in seconds and can become an MVP quickly.",
  "Avoid empty buzzwords, vague consumer concepts, and saturated copycats.",
].join(" ");

const TAG_RULES: Array<{ tag: string; keywords: string[] }> = [
  { tag: "b2b-automation", keywords: ["automation", "workflow", "operations", "ops", "back office", "invoice", "crm", "compliance", "b2b"] },
  { tag: "developer-tools", keywords: ["developer", "devtool", "api", "sdk", "code", "debug", "deploy", "observability"] },
  { tag: "ai-productivity", keywords: ["ai", "assistant", "copilot", "productivity", "summarize", "meeting notes"] },
  { tag: "sales-marketing", keywords: ["sales", "lead", "marketing", "seo", "campaign", "funnel", "ads"] },
  { tag: "ecommerce", keywords: ["ecommerce", "shop", "checkout", "store", "merchant", "catalog"] },
  { tag: "fintech", keywords: ["finance", "accounting", "billing", "expense", "payment", "cash flow"] },
  { tag: "hr-ops", keywords: ["recruit", "hiring", "hr", "employee", "payroll", "onboarding"] },
  { tag: "vertical-saas", keywords: ["clinic", "restaurant", "construction", "legal", "real estate", "warehouse"] },
  { tag: "analytics", keywords: ["analytics", "dashboard", "metrics", "reporting", "insights", "forecast"] },
  { tag: "social-network", keywords: ["social network", "social app", "community app", "followers", "creator network"] },
  { tag: "generic-chatbot", keywords: ["chatbot", "chat bot", "general ai chat", "qa bot"] },
  { tag: "crypto-clone", keywords: ["crypto", "token", "nft", "blockchain", "web3"] },
  { tag: "consumer-app", keywords: ["consumer", "friends", "family", "dating", "lifestyle", "social"] },
];

type IdeaForScoring = {
  id: number;
  title: string;
  slogan: string;
  description: string;
  aiPrompt: string;
  createdAt: Date;
  expiresAt: Date;
  totalVotes: number;
  winCount: number;
  lossCount: number;
  duelExposures: number;
  firstExposedAt: Date | null;
  firstVoteAt: Date | null;
  lastVoteAt: Date | null;
  categoryTags: string[];
  status: IdeaStatus;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hoursBetween(a: Date, b: Date) {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60);
}

function daysSince(date: Date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function normalizeText(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

// --- Idea similarity deduplication ---

const SIMILARITY_STOP_WORDS = new Set([
  'a','an','the','for','to','of','and','or','in','on','at','is','by','be',
  'app','saas','platform','tool','service','software','with','your','you',
  'my','our','that','this','it','its','from','about','into','small','big',
  'smart','better','simple','easy','new','free','pro','get','use','make',
]);

function titleTokens(text: string): Set<string> {
  return new Set(
    normalizeText(text)
      .split(/\s+/)
      .filter(w => w.length > 2 && !SIMILARITY_STOP_WORDS.has(w))
  );
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function areTitlesSimilar(titleA: string, titleB: string, threshold = 0.45): boolean {
  return jaccardSimilarity(titleTokens(titleA), titleTokens(titleB)) >= threshold;
}

export function extractCategoryTags(...parts: Array<string | null | undefined>) {
  const haystack = normalizeText(parts.filter(Boolean).join(" "));
  const tags = new Set<string>();

  for (const rule of TAG_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(normalizeText(keyword)))) {
      tags.add(rule.tag);
    }
  }

  if (tags.size === 0) {
    tags.add("other");
  }

  return Array.from(tags);
}

function wilsonLowerBound(wins: number, total: number, confidence = 1.96) {
  if (total === 0) {
    return 0;
  }

  const ratio = wins / total;
  const z2 = confidence * confidence;
  const denominator = 1 + z2 / total;
  const center = ratio + z2 / (2 * total);
  const margin = confidence * Math.sqrt((ratio * (1 - ratio) + z2 / (4 * total)) / total);

  return (center - margin) / denominator;
}

export function computeIdeaScores(idea: IdeaForScoring, recentVotes = 0) {
  const ageDays = clamp(daysSince(idea.createdAt), 0, IDEA_ACTIVE_DAYS);
  const winRate = idea.totalVotes > 0 ? idea.winCount / idea.totalVotes : 0;
  const wilson = wilsonLowerBound(idea.winCount, idea.totalVotes);
  const freshnessScore = clamp(1 - ageDays / IDEA_ACTIVE_DAYS, 0, 1);
  const explorationBonus = 1 / Math.sqrt(1 + idea.duelExposures);

  let earlyEngagement = 0;
  if (idea.totalVotes > 0 && idea.firstExposedAt && idea.firstVoteAt) {
    const responseHours = Math.max(1, hoursBetween(idea.firstExposedAt, idea.firstVoteAt));
    earlyEngagement = 1 / responseHours;
  }

  const engagementScore = clamp(0.7 * wilson + 0.3 * earlyEngagement, 0, 1);
  const rankingScore =
    0.35 * wilson +
    0.25 * earlyEngagement +
    0.2 * freshnessScore +
    0.2 * explorationBonus;
  const trendScore = recentVotes * Math.max(winRate, 0.05) * Math.max(freshnessScore, 0.1);

  return {
    winRate,
    engagementScore,
    rankingScore,
    trendScore,
    score: idea.winCount,
  };
}

export function deriveIdeaStatus(idea: {
  expiresAt: Date;
  totalVotes: number;
  winRate: number;
  engagementScore: number;
  recentVotes?: number;
}) {
  if (idea.expiresAt.getTime() <= Date.now()) {
    return idea.totalVotes === 0 ? IdeaStatus.UNPOPULAR : IdeaStatus.ARCHIVED;
  }

  if (
    (idea.recentVotes ?? 0) >= TRENDING_MIN_VOTES &&
    idea.winRate >= TRENDING_MIN_WIN_RATE &&
    idea.engagementScore >= 0.25
  ) {
    return IdeaStatus.TRENDING;
  }

  return IdeaStatus.ACTIVE;
}

export function buildGenerationPrompt(positiveTags: string[] = [], negativeTags: string[] = []) {
  const preferred = positiveTags.length > 0
    ? positiveTags.join(", ")
    : "B2B automation, developer tools, AI productivity, analytics, vertical SaaS";
  const avoided = negativeTags.length > 0
    ? negativeTags.join(", ")
    : "generic social networks, undifferentiated chatbots, crypto clones, vague consumer apps";

  return [
    BASE_GENERATION_INSTRUCTION,
    `Favor domains such as ${preferred}.`,
    `Reduce or avoid ideas in these categories: ${avoided}.`,
    "Keep some variation, but stay close to segments with strong engagement and clear ROI.",
  ].join(" ");
}

export function weightedPick<T>(items: T[], getWeight: (item: T) => number) {
  if (items.length === 0) {
    return null;
  }

  const weighted = items.map((item) => ({ item, weight: Math.max(getWeight(item), 0.0001) }));
  const total = weighted.reduce((sum, current) => sum + current.weight, 0);
  let threshold = Math.random() * total;

  for (const entry of weighted) {
    threshold -= entry.weight;
    if (threshold <= 0) {
      return entry.item;
    }
  }

  return weighted[weighted.length - 1].item;
}

export async function recomputeIdeaAnalytics(ideaId: number) {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: {
      id: true,
      title: true,
      slogan: true,
      description: true,
      aiPrompt: true,
      createdAt: true,
      expiresAt: true,
      totalVotes: true,
      winCount: true,
      lossCount: true,
      duelExposures: true,
      firstExposedAt: true,
      firstVoteAt: true,
      lastVoteAt: true,
      categoryTags: true,
      status: true,
    },
  });

  if (!idea) {
    return null;
  }

  const recentWindowStart = new Date(Date.now() - TRENDING_STALE_HOURS * 60 * 60 * 1000);
  const recentVotes = await prisma.vote.count({
    where: {
      createdAt: { gte: recentWindowStart },
      OR: [{ winnerIdeaId: ideaId }, { loserIdeaId: ideaId }],
    },
  });

  const scores = computeIdeaScores(idea, recentVotes);
  const nextStatus = deriveIdeaStatus({ ...idea, ...scores, recentVotes });

  return prisma.idea.update({
    where: { id: ideaId },
    data: {
      winRate: scores.winRate,
      engagementScore: scores.engagementScore,
      rankingScore: scores.rankingScore,
      trendScore: scores.trendScore,
      score: scores.score,
      status: nextStatus,
      archivedAt: nextStatus === IdeaStatus.ARCHIVED ? new Date() : null,
      categoryTags: idea.categoryTags.length > 0 ? idea.categoryTags : extractCategoryTags(idea.title, idea.slogan, idea.description, idea.aiPrompt),
    },
  });
}

export async function syncIdeaLifecycleStatuses() {
  const now = new Date();
  const staleTrendCutoff = new Date(Date.now() - TRENDING_STALE_HOURS * 60 * 60 * 1000);

  await prisma.idea.updateMany({
    where: {
      expiresAt: { lte: now },
      totalVotes: 0,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING] },
    },
    data: { status: IdeaStatus.UNPOPULAR },
  });

  await prisma.idea.updateMany({
    where: {
      expiresAt: { lte: now },
      totalVotes: { gt: 0 },
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING] },
    },
    data: { status: IdeaStatus.ARCHIVED, archivedAt: now },
  });

  await prisma.idea.updateMany({
    where: {
      status: IdeaStatus.TRENDING,
      expiresAt: { gt: now },
      OR: [
        { lastVoteAt: { lt: staleTrendCutoff } },
        { lastVoteAt: null },
        { trendScore: { lt: 1 } },
      ],
    },
    data: { status: IdeaStatus.ACTIVE },
  });

  await prisma.idea.updateMany({
    where: {
      status: IdeaStatus.ACTIVE,
      expiresAt: { gt: now },
      totalVotes: { gte: TRENDING_MIN_VOTES },
      winRate: { gte: TRENDING_MIN_WIN_RATE },
      engagementScore: { gte: 0.25 },
    },
    data: { status: IdeaStatus.TRENDING },
  });
}

export async function recordDuelExposure(ideaAId: number, ideaBId: number, voterId?: string) {
  const shownAt = new Date();
  const duelKey = `${shownAt.toISOString()}-${Math.min(ideaAId, ideaBId)}-${Math.max(ideaAId, ideaBId)}-${voterId ?? "anon"}`;

  await prisma.$transaction([
    prisma.duelExposure.create({
      data: {
        duelKey,
        voterId,
        ideaAId,
        ideaBId,
        shownAt,
      },
    }),
    prisma.idea.update({
      where: { id: ideaAId },
      data: {
        duelExposures: { increment: 1 },
        lastExposedAt: shownAt,
      },
    }),
    prisma.idea.update({
      where: { id: ideaBId },
      data: {
        duelExposures: { increment: 1 },
        lastExposedAt: shownAt,
      },
    }),
  ]);

  await prisma.idea.updateMany({
    where: {
      id: { in: [ideaAId, ideaBId] },
      firstExposedAt: null,
    },
    data: {
      firstExposedAt: shownAt,
    },
  });

  return duelKey;
}

export async function markExposureAsVoted(winnerId: number, loserId: number, voterId: string) {
  const exposure = await prisma.duelExposure.findFirst({
    where: {
      voterId,
      votedAt: null,
      OR: [
        { ideaAId: winnerId, ideaBId: loserId },
        { ideaAId: loserId, ideaBId: winnerId },
      ],
    },
    orderBy: { shownAt: "desc" },
  });

  if (!exposure) {
    return null;
  }

  return prisma.duelExposure.update({
    where: { id: exposure.id },
    data: {
      votedAt: new Date(),
      winnerIdeaId: winnerId,
      loserIdeaId: loserId,
    },
  });
}

function outsiderWeight(idea: { duelExposures: number; totalVotes: number; createdAt: Date }) {
  const exposureScore = 1 / (1 + idea.duelExposures);
  const freshnessScore = clamp(1 - daysSince(idea.createdAt) / IDEA_ACTIVE_DAYS, 0, 1);
  const uncertaintyScore = 1 / Math.sqrt(1 + idea.totalVotes);
  return 0.5 * exposureScore + 0.3 * freshnessScore + 0.2 * uncertaintyScore;
}

function opponentWeight(idea: {
  duelExposures: number;
  totalVotes: number;
  createdAt: Date;
  winRate: number;
  status: IdeaStatus;
}) {
  const exposureScore = 1 / (1 + idea.duelExposures);
  const freshnessScore = clamp(1 - daysSince(idea.createdAt) / IDEA_ACTIVE_DAYS, 0, 1);
  const uncertaintyScore = 1 / Math.sqrt(1 + idea.totalVotes);
  const mediumBandScore = 1 - Math.abs((idea.winRate || 0.5) - 0.55);
  const trendingPenalty = idea.status === IdeaStatus.TRENDING ? 0.25 : 1;
  return trendingPenalty * (0.4 * exposureScore + 0.25 * freshnessScore + 0.2 * uncertaintyScore + 0.15 * mediumBandScore);
}

export async function getActivePromptProfile() {
  const activeProfile = await prisma.promptProfile.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (activeProfile) {
    return activeProfile;
  }

  const bootstrapPrompt = buildGenerationPrompt();
  return prisma.promptProfile.create({
    data: {
      version: 1,
      baseInstruction: BASE_GENERATION_INSTRUCTION,
      generatedPrompt: bootstrapPrompt,
      positiveTags: [],
      negativeTags: [],
      rationale: "Bootstrap prompt profile before enough voting data exists.",
      active: true,
    },
  });
}

export async function optimizePromptProfile() {
  const ideas = await prisma.idea.findMany({
    where: {
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.ARCHIVED, IdeaStatus.TRENDING, IdeaStatus.UNPOPULAR] },
      isReserved: false,
    },
    select: {
      id: true,
      title: true,
      slogan: true,
      description: true,
      aiPrompt: true,
      createdAt: true,
      expiresAt: true,
      totalVotes: true,
      winCount: true,
      lossCount: true,
      duelExposures: true,
      firstExposedAt: true,
      firstVoteAt: true,
      lastVoteAt: true,
      categoryTags: true,
      status: true,
      winRate: true,
      engagementScore: true,
      rankingScore: true,
    },
  });

  if (ideas.length === 0) {
    return getActivePromptProfile();
  }

  const hydratedIdeas = ideas.map((idea) => ({
    ...idea,
    categoryTags: idea.categoryTags.length > 0 ? idea.categoryTags : extractCategoryTags(idea.title, idea.slogan, idea.description, idea.aiPrompt),
  }));

  const rankedIdeas = [...hydratedIdeas].sort((a, b) => b.rankingScore - a.rankingScore);
  const bucketSize = Math.max(1, Math.ceil(rankedIdeas.length * 0.2));
  const topIdeas = rankedIdeas.slice(0, bucketSize);
  const bottomIdeas = rankedIdeas.slice(-bucketSize);
  const ignoredIdeas = hydratedIdeas.filter((idea) => idea.duelExposures >= IGNORED_EXPOSURE_THRESHOLD && idea.totalVotes === 0);
  const unpopularIdeas = hydratedIdeas.filter((idea) => idea.status === IdeaStatus.UNPOPULAR);

  const tagScores = new Map<string, number>();

  const applyDelta = (tags: string[], delta: number) => {
    for (const tag of tags) {
      tagScores.set(tag, (tagScores.get(tag) ?? 0) + delta);
    }
  };

  for (const idea of topIdeas) {
    applyDelta(idea.categoryTags, Math.max(0.5, idea.engagementScore) * Math.log1p(Math.max(idea.totalVotes, 1)));
  }

  for (const idea of bottomIdeas) {
    applyDelta(idea.categoryTags, -1 * Math.max(1, idea.lossCount || 1));
  }

  for (const idea of ignoredIdeas) {
    applyDelta(idea.categoryTags, -2);
  }

  for (const idea of unpopularIdeas) {
    applyDelta(idea.categoryTags, -3);
  }

  const sortedTags = Array.from(tagScores.entries()).sort((a, b) => b[1] - a[1]);
  const positiveTags = sortedTags.filter(([, score]) => score > 0).slice(0, 8).map(([tag]) => tag);
  const negativeTags = [...sortedTags].reverse().filter(([, score]) => score < 0).slice(0, 8).map(([tag]) => tag);
  const generatedPrompt = buildGenerationPrompt(positiveTags, negativeTags);

  const currentActive = await prisma.promptProfile.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  const lastVersion = await prisma.promptProfile.aggregate({ _max: { version: true } });

  await prisma.promptProfile.updateMany({
    where: { active: true },
    data: { active: false },
  });

  return prisma.promptProfile.create({
    data: {
      version: (lastVersion._max.version ?? 0) + 1,
      baseInstruction: BASE_GENERATION_INSTRUCTION,
      generatedPrompt,
      positiveTags,
      negativeTags,
      rationale: currentActive && currentActive.generatedPrompt === generatedPrompt
        ? "Prompt regenerated from latest vote data without major directional shift."
        : "Prompt updated from top ideas, bottom ideas, and ignored ideas.",
      active: true,
      topIdeasCount: topIdeas.length,
      bottomIdeasCount: bottomIdeas.length,
      ignoredIdeasCount: ignoredIdeas.length,
    },
  });
}

export async function selectDuelIdeas(voterId?: string, previousWinnerIdeaId?: number, excludeOpponentId?: number) {
  const eligibleIdeas = await prisma.idea.findMany({
    where: {
      isReserved: false,
      expiresAt: { gt: new Date() },
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING] },
    },
    select: {
      id: true,
      duelExposures: true,
      totalVotes: true,
      createdAt: true,
      winRate: true,
      status: true,
      rankingScore: true,
    },
    orderBy: [
      { rankingScore: "desc" },
      { createdAt: "desc" },
    ],
    take: 150,
  });

  if (eligibleIdeas.length < 2) {
    return null;
  }

  const hydratePair = async (ideaAId: number, ideaBId: number) => {
    const fullIdeas = await prisma.idea.findMany({
      where: { id: { in: [ideaAId, ideaBId] } },
      select: {
        id: true,
        title: true,
        slogan: true,
        description: true,
        aiPromptId: true,
        aiPrompt: true,
        translations: true,
        origin: true,
        isCommunityValidated: true,
        audience: true,
        score: true,
        status: true,
        totalVotes: true,
        duelExposures: true,
        winRate: true,
      },
    });

    const byId = new Map(fullIdeas.map((idea) => [idea.id, idea]));
    const ideaA = byId.get(ideaAId);
    const ideaB = byId.get(ideaBId);

    if (!ideaA || !ideaB) {
      return null;
    }

    return { ideaA, ideaB };
  };

  const eligibleIdeaIds = eligibleIdeas.map((idea) => idea.id);

  const voterVotes = voterId
    ? await prisma.vote.findMany({
        where: {
          voterId,
          winnerIdeaId: { in: eligibleIdeaIds },
          loserIdeaId: { in: eligibleIdeaIds },
        },
        select: { winnerIdeaId: true, loserIdeaId: true },
      })
    : [];

  const votedPairs = new Set(
    voterVotes.map((vote) => `${Math.min(vote.winnerIdeaId, vote.loserIdeaId)}-${Math.max(vote.winnerIdeaId, vote.loserIdeaId)}`)
  );

  const previousWinner = previousWinnerIdeaId
    ? eligibleIdeas.find((idea) => idea.id === previousWinnerIdeaId)
    : undefined;

  // Keep the previous winner on the left when a valid unseen matchup exists.
  if (previousWinner && (!excludeOpponentId || previousWinner.id !== excludeOpponentId)) {
    const previousWinnerOpponentPool = eligibleIdeas.filter((idea) => {
      if (idea.id === previousWinner.id) {
        return false;
      }
      if (excludeOpponentId && idea.id === excludeOpponentId) {
        return false;
      }
      const pairKey = `${Math.min(idea.id, previousWinner.id)}-${Math.max(idea.id, previousWinner.id)}`;
      return !votedPairs.has(pairKey);
    });

    const previousWinnerOpponent = weightedPick(previousWinnerOpponentPool, (idea) => opponentWeight(idea));

    if (previousWinnerOpponent) {
      void recordDuelExposure(previousWinner.id, previousWinnerOpponent.id, voterId).catch((error) => {
        console.error("Failed to record duel exposure:", error);
      });

      const hydrated = await hydratePair(previousWinner.id, previousWinnerOpponent.id);
      if (!hydrated) {
        return { noMoreDuels: true as const };
      }

      return {
        ideaA: hydrated.ideaA,
        ideaB: hydrated.ideaB,
        noMoreDuels: false as const,
      };
    }
  }

  const basePool = eligibleIdeas.filter((idea) => {
    if (excludeOpponentId && idea.id === excludeOpponentId) {
      return false;
    }
    return true;
  });

  const candidatePool = basePool.length > 0 ? basePool : eligibleIdeas;
  const outsiderPool = candidatePool.filter((idea) => {
    return (
      idea.duelExposures < OUTSIDER_EXPOSURE_THRESHOLD ||
      idea.totalVotes < OUTSIDER_VOTE_THRESHOLD ||
      daysSince(idea.createdAt) <= 3
    );
  });

  const outsiderCandidates = (outsiderPool.length > 0 ? outsiderPool : candidatePool).filter((idea) => {
    return candidatePool.some((opponent) => {
      if (opponent.id === idea.id) {
        return false;
      }
      const pairKey = `${Math.min(opponent.id, idea.id)}-${Math.max(opponent.id, idea.id)}`;
      return !votedPairs.has(pairKey);
    });
  });

  const outsider = weightedPick(outsiderCandidates, (idea) => outsiderWeight(idea));
  if (!outsider) {
    return { noMoreDuels: true as const };
  }

  const opponentPool = candidatePool.filter((idea) => {
    if (idea.id === outsider.id) {
      return false;
    }
    const pairKey = `${Math.min(idea.id, outsider.id)}-${Math.max(idea.id, outsider.id)}`;
    return !votedPairs.has(pairKey);
  });

  if (opponentPool.length === 0) {
    return { noMoreDuels: true as const };
  }

  const opponent = weightedPick(opponentPool, (idea) => opponentWeight(idea));
  if (!opponent) {
    return { noMoreDuels: true as const };
  }

  void recordDuelExposure(outsider.id, opponent.id, voterId).catch((error) => {
    console.error("Failed to record duel exposure:", error);
  });

  const hydrated = await hydratePair(outsider.id, opponent.id);
  if (!hydrated) {
    return { noMoreDuels: true as const };
  }

  return {
    ideaA: hydrated.ideaA,
    ideaB: hydrated.ideaB,
    noMoreDuels: false as const,
  };
}

export async function cleanupIdeaLifecycle() {
  await syncIdeaLifecycleStatuses();

  const ideasToRefresh = await prisma.idea.findMany({
    where: {
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED, IdeaStatus.UNPOPULAR] },
    },
    select: { id: true },
  });

  for (const idea of ideasToRefresh) {
    await recomputeIdeaAnalytics(idea.id);
  }

  return prisma.idea.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
}

export async function deduplicateSimilarIdeas(
  threshold = 0.45
): Promise<{ archived: number; kept: number; pairs: [string, string][] }> {
  const ideas = await prisma.idea.findMany({
    where: {
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.UNPOPULAR] },
      isReserved: false,
    },
    select: { id: true, title: true, totalVotes: true },
    orderBy: { totalVotes: 'desc' }, // highest-voted idea wins ties
  });

  const toArchive = new Set<number>();
  const pairs: [string, string][] = [];

  for (let i = 0; i < ideas.length; i++) {
    if (toArchive.has(ideas[i].id)) continue;
    for (let j = i + 1; j < ideas.length; j++) {
      if (toArchive.has(ideas[j].id)) continue;
      if (areTitlesSimilar(ideas[i].title, ideas[j].title, threshold)) {
        // ideas[i] has >= votes (sorted by totalVotes desc) → archive ideas[j]
        toArchive.add(ideas[j].id);
        pairs.push([ideas[i].title, ideas[j].title]);
      }
    }
  }

  if (toArchive.size > 0) {
    await prisma.idea.updateMany({
      where: { id: { in: Array.from(toArchive) } },
      data: { status: IdeaStatus.ARCHIVED, archivedAt: new Date() },
    });
  }

  return { archived: toArchive.size, kept: ideas.length - toArchive.size, pairs };
}

export type ActivePromptProfile = PromptProfile;