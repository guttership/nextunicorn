"use server";

import { prisma } from "@/app/lib/db/prisma";
type IdeaLike = {
  id: number;
  title: string;
  slogan?: string | null;
  description?: string | null;
  aiPromptId?: string | null;
  aiPrompt?: string | null;
  translations?: any[];
  generatedAt?: string | Date | null;
  isReserved?: boolean;
  origin?: string | null;
  isCommunityValidated?: boolean | null;
  audience?: string | null;
  score?: number;
};
import { revalidatePath } from "next/cache";

export async function getDailyDuel(excludeIdeaId?: number, voterId?: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get ALL ideas (not just today's) - exclude reserved ones
    const allIdeas = await prisma.idea.findMany({
      where: {
        isReserved: false,
      },
      include: {
        translations: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    if (allIdeas.length < 2) {
      return null;
    }

    // Get ALL votes from THIS VOTER to exclude already-voted pairs
    const voterVotes = voterId ? await prisma.vote.findMany({
      where: {
        voterId: voterId,
      },
      select: {
        winnerIdeaId: true,
        loserIdeaId: true,
      },
    }) : [];

    // Create set of voted pairs by THIS voter (normalized)
    const votedPairs = new Set(
      voterVotes.map((vote: { winnerIdeaId: number; loserIdeaId: number }) => {
        const min = Math.min(vote.winnerIdeaId, vote.loserIdeaId);
        const max = Math.max(vote.winnerIdeaId, vote.loserIdeaId);
        return `${min}-${max}`;
      })
    );

    // If we need to exclude an idea (winner from previous battle)
    if (excludeIdeaId) {
      const winnerIdea = allIdeas.find((idea: IdeaLike) => idea.id === excludeIdeaId);
      if (winnerIdea) {
        // Get available opponents (not already voted with this idea by THIS voter)
        const availableOpponents = allIdeas.filter((idea: IdeaLike) => {
          if (idea.id === excludeIdeaId) return false;
          const pairKey = `${Math.min(excludeIdeaId, idea.id)}-${Math.max(excludeIdeaId, idea.id)}`;
          return !votedPairs.has(pairKey);
        });

        if (availableOpponents.length === 0) {
          // No more opponents available for this voter
          return { noMoreDuels: true };
        }

        const ideaB = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

        return {
          ideaA: winnerToObject(winnerIdea),
          ideaB: ideaToObject(ideaB),
          noMoreDuels: false,
        };
      }
    }

    // Priority: Get today's new ideas and oppose them to ALL existing ideas
    const todayIdeas = allIdeas.filter((idea: IdeaLike) => {
      if (!idea.generatedAt) return false;
      const ideaDate = new Date(idea.generatedAt as string | number | Date);
      ideaDate.setHours(0, 0, 0, 0);
      return ideaDate.getTime() === today.getTime();
    });

    // If there are today's ideas, prioritize them
    if (todayIdeas.length > 0) {
      // Pick a random new idea
      const newIdea = todayIdeas[Math.floor(Math.random() * todayIdeas.length)];
      
      // Find available opponents (from ALL ideas, not just today)
      const availableOpponents = allIdeas.filter((idea: IdeaLike) => {
        if (idea.id === newIdea.id) return false;
        const pairKey = `${Math.min(newIdea.id, idea.id)}-${Math.max(newIdea.id, idea.id)}`;
        return !votedPairs.has(pairKey);
      });

      if (availableOpponents.length > 0) {
        const opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
        return {
          ideaA: ideaToObject(newIdea),
          ideaB: ideaToObject(opponent),
          noMoreDuels: false,
        };
      }
    }

    // No today's ideas or all paired already - build list of ALL unvoted pairs
    const unvotedPairs: Array<[IdeaLike, IdeaLike]> = [];
    for (let i = 0; i < allIdeas.length; i++) {
      for (let j = i + 1; j < allIdeas.length; j++) {
        const pairKey = `${allIdeas[i].id}-${allIdeas[j].id}`;
        if (!votedPairs.has(pairKey)) {
          unvotedPairs.push([allIdeas[i], allIdeas[j]]);
        }
      }
    }

    // If there are unvoted pairs, pick a random one
    if (unvotedPairs.length > 0) {
      const [ideaA, ideaB] = unvotedPairs[Math.floor(Math.random() * unvotedPairs.length)];
      return {
        ideaA: ideaToObject(ideaA),
        ideaB: ideaToObject(ideaB),
        noMoreDuels: false,
      };
    }

    // This voter has voted on ALL possible pairs!
    return { noMoreDuels: true };
  } catch (error) {
    console.error("Error getting daily duel:", error);
    throw error;
  }
}

function ideaToObject(idea: IdeaLike) {
  return {
    id: idea.id,
    title: idea.title,
    slogan: idea.slogan,
    description: idea.description,
    aiPromptId: idea.aiPromptId,
    aiPrompt: idea.aiPrompt,
    translations: idea.translations || [],
    origin: idea.origin || 'AI',
    isCommunityValidated: !!idea.isCommunityValidated,
    audience: idea.audience || null,
  };
}

function winnerToObject(idea: IdeaLike) {
  return ideaToObject(idea);
}

export async function handleVote(
  winnerId: number,
  loserId: number,
  voterId: string
) {
  try {
    // Create unique duelId based on idea IDs and date
    const today = new Date().toISOString().split("T")[0];
    const duelId = `${today}-${Math.min(winnerId, loserId)}-${Math.max(winnerId, loserId)}`;

    // Increment winner's score
    await prisma.idea.update({
      where: { id: winnerId },
      data: { score: { increment: 1 } },
    });

    // Record the vote (will silently fail if already exists due to unique constraint)
    try {
      await prisma.vote.create({
        data: {
          voterId,
          winnerIdeaId: winnerId,
          loserIdeaId: loserId,
          duelId,
        },
      });
    } catch {
      // Silently ignore duplicate vote constraint
    }

    return { success: true };
  } catch (error) {
    console.error("Error handling vote:", error);
    throw error;
  }
}

export async function getIdeaRanking(limit: number = 10) {
  try {
    // Force revalidation to avoid cache issues
    revalidatePath('/leaderboard');
    
    const ideas = await prisma.idea.findMany({
      where: {
        isReserved: false,
      },
      orderBy: {
        score: "desc",
      },
      include: {
        translations: true,
      },
    });

    console.log('[DEBUG getIdeaRanking] Total ideas found:', ideas.length);

    return ideas.map((idea: IdeaLike, index: number) => ({
      rank: index + 1,
      id: idea.id,
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description,
      score: idea.score,
      aiPromptId: idea.aiPromptId,
      isReserved: idea.isReserved,
      translations: idea.translations,      origin: idea.origin || 'AI',
      isCommunityValidated: !!idea.isCommunityValidated,
      audience: idea.audience || null,    }));
  } catch (error) {
    console.error("Error getting idea ranking:", error);
    throw error;
  }
}
