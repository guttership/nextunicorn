"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/lib/db/prisma";
import {
  markExposureAsVoted,
  selectDuelIdeas,
} from "@/app/lib/idea-engine";

type IdeaLike = {
  id: number;
  title: string;
  slogan?: string | null;
  description?: string | null;
  aiPromptId?: string | null;
  aiPrompt?: string | null;
  translations?: Array<{
    language: string;
    title: string;
    slogan: string;
    description: string;
    aiPrompt: string;
  }>;
  origin?: string | null;
  isCommunityValidated?: boolean | null;
  audience?: string | null;
  score?: number;
  status?: string;
  totalVotes?: number;
  duelExposures?: number;
  winRate?: number;
};

function ideaToObject(idea: IdeaLike) {
  return {
    id: idea.id,
    title: idea.title,
    slogan: idea.slogan,
    description: idea.description,
    aiPromptId: idea.aiPromptId,
    aiPrompt: idea.aiPrompt,
    translations: idea.translations || [],
    origin: idea.origin || "AI",
    isCommunityValidated: !!idea.isCommunityValidated,
    audience: idea.audience || null,
    score: idea.score || 0,
    status: idea.status || "ACTIVE",
    totalVotes: idea.totalVotes || 0,
    duelExposures: idea.duelExposures || 0,
    winRate: idea.winRate || 0,
  };
}

export async function getDailyDuel(excludeIdeaId?: number, voterId?: string, excludeOpponentId?: number) {
  try {
    const duel = await selectDuelIdeas(voterId, excludeIdeaId, excludeOpponentId);

    if (!duel) {
      return null;
    }

    if ("noMoreDuels" in duel && duel.noMoreDuels) {
      return duel;
    }

    return {
      ideaA: ideaToObject(duel.ideaA),
      ideaB: ideaToObject(duel.ideaB),
      noMoreDuels: false,
    };
  } catch (error) {
    console.error("Error getting daily duel:", error);
    throw error;
  }
}

export async function handleVote(winnerId: number, loserId: number, voterId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const duelId = `${today}-${Math.min(winnerId, loserId)}-${Math.max(winnerId, loserId)}`;
    const voteTimestamp = new Date();

    try {
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            voterId,
            winnerIdeaId: winnerId,
            loserIdeaId: loserId,
            duelId,
          },
        }),
        prisma.idea.update({
          where: { id: winnerId },
          data: {
            score: { increment: 1 },
            totalVotes: { increment: 1 },
            winCount: { increment: 1 },
            lastVoteAt: voteTimestamp,
          },
        }),
        prisma.idea.update({
          where: { id: loserId },
          data: {
            totalVotes: { increment: 1 },
            lossCount: { increment: 1 },
            lastVoteAt: voteTimestamp,
          },
        }),
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("unique") || message.toLowerCase().includes("duplicate")) {
        return { success: true, duplicate: true };
      }
      throw error;
    }

    await prisma.idea.updateMany({
      where: {
        id: { in: [winnerId, loserId] },
        firstVoteAt: null,
      },
      data: {
        firstVoteAt: voteTimestamp,
      },
    });

    await markExposureAsVoted(winnerId, loserId, voterId);

    revalidatePath("/leaderboard");

    return { success: true };
  } catch (error) {
    console.error("Error handling vote:", error);
    throw error;
  }
}

export async function getIdeaRanking(limit = 10) {
  try {
    revalidatePath("/leaderboard");

    const ideas = await prisma.idea.findMany({
      where: {
        isReserved: false,
        status: {
          not: "UNPOPULAR",
        },
      },
      orderBy: [
        { totalVotes: "desc" },
        { score: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        translations: true,
      },
      take: limit,
    });

    return ideas.map((idea, index) => ({
      rank: index + 1,
      id: idea.id,
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description,
      score: idea.score,
      rankingScore: idea.rankingScore,
      status: idea.status,
      totalVotes: idea.totalVotes,
      duelExposures: idea.duelExposures,
      winRate: idea.winRate,
      aiPromptId: idea.aiPromptId,
      isReserved: idea.isReserved,
      translations: idea.translations,
      origin: idea.origin || "AI",
      isCommunityValidated: !!idea.isCommunityValidated,
      audience: idea.audience || null,
    }));
  } catch (error) {
    console.error("Error getting idea ranking:", error);
    throw error;
  }
}

export async function generateIdeasBatch() {
  try {
    const apiSecret = process.env.CRON_SECRET || process.env.API_SECRET;
    const vercelUrl = process.env.VERCEL_URL;
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

    const headers: Record<string, string> = {};
    if (apiSecret) {
      headers.authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(`${baseUrl}/api/ideas/generate`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error:
          typeof result?.error === "string"
            ? result.error
            : "Failed to generate ideas",
      };
    }

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error generating ideas batch:", error);
    return {
      ok: false,
      error: "Failed to generate ideas",
    };
  }
}
