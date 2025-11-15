"use server";

import { prisma } from "@/app/lib/db/prisma";

export async function getDailyDuel(excludeIdeaId?: number) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's ideas
    let todayIdeas = await prisma.idea.findMany({
      where: {
        generatedAt: {
          gte: today,
        },
      },
      include: {
        translations: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    // If not enough ideas for today, get the best ideas from all time
    if (todayIdeas.length < 2) {
      todayIdeas = await prisma.idea.findMany({
        include: {
          translations: true,
        },
        orderBy: {
          score: "desc",
        },
        take: 100, // Get top 100 ideas overall
      });
    }

    if (todayIdeas.length < 2) {
      return null;
    }

    // Get votes from today to exclude already-voted pairs
    const todayVotes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
      select: {
        winnerIdeaId: true,
        loserIdeaId: true,
      },
    });

    // Create set of voted pairs (normalized)
    const votedPairs = new Set(
      todayVotes.map((vote) => {
        const min = Math.min(vote.winnerIdeaId, vote.loserIdeaId);
        const max = Math.max(vote.winnerIdeaId, vote.loserIdeaId);
        return `${min}-${max}`;
      })
    );

    // If we need to exclude an idea (winner from previous battle)
    if (excludeIdeaId) {
      const winnerIdea = todayIdeas.find((idea) => idea.id === excludeIdeaId);
      if (winnerIdea) {
        // Get available opponents (not already voted with this idea)
        const availableOpponents = todayIdeas.filter((idea) => {
          if (idea.id === excludeIdeaId) return false;
          const pairKey = `${Math.min(excludeIdeaId, idea.id)}-${Math.max(excludeIdeaId, idea.id)}`;
          return !votedPairs.has(pairKey);
        });

        if (availableOpponents.length === 0) {
          // All opponents already voted, pick any except winner
          const ideaB = todayIdeas.find((idea) => idea.id !== excludeIdeaId);
          if (!ideaB) return null;
          
          return {
            ideaA: winnerToObject(winnerIdea),
            ideaB: ideaToObject(ideaB),
          };
        }

        const ideaB = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

        return {
          ideaA: winnerToObject(winnerIdea),
          ideaB: ideaToObject(ideaB),
        };
      }
    }

    // Check if there's a champion from yesterday
    const champion = todayIdeas.find((idea) => idea.isChampion);

    if (champion) {
      // Get available opponents for champion
      const availableOpponents = todayIdeas.filter((idea) => {
        if (idea.id === champion.id) return false;
        const pairKey = `${Math.min(champion.id, idea.id)}-${Math.max(champion.id, idea.id)}`;
        return !votedPairs.has(pairKey);
      });

      if (availableOpponents.length === 0) {
        // All opponents already voted, pick any except champion
        const ideaB = todayIdeas.find((idea) => idea.id !== champion.id);
        if (!ideaB) return null;
        
        return {
          ideaA: ideaToObject(champion),
          ideaB: ideaToObject(ideaB),
        };
      }

      const ideaB = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

      return {
        ideaA: ideaToObject(champion),
        ideaB: ideaToObject(ideaB),
      };
    }

    // Two random ideas that haven't voted together
    // Build list of all unvoted pairs
    const unvotedPairs: Array<[any, any]> = [];
    for (let i = 0; i < todayIdeas.length; i++) {
      for (let j = i + 1; j < todayIdeas.length; j++) {
        const pairKey = `${todayIdeas[i].id}-${todayIdeas[j].id}`;
        if (!votedPairs.has(pairKey)) {
          unvotedPairs.push([todayIdeas[i], todayIdeas[j]]);
        }
      }
    }

    // If there are unvoted pairs, pick a random one
    if (unvotedPairs.length > 0) {
      const [ideaA, ideaB] = unvotedPairs[Math.floor(Math.random() * unvotedPairs.length)];
      return {
        ideaA: ideaToObject(ideaA),
        ideaB: ideaToObject(ideaB),
      };
    }

    // All pairs have been voted on, so just return any two different ideas
    const ideaA = todayIdeas[0];
    const ideaB = todayIdeas.find((idea) => idea.id !== ideaA.id);
    
    if (!ideaB) throw new Error("No valid opponent found");
    
    return {
      ideaA: ideaToObject(ideaA),
      ideaB: ideaToObject(ideaB),
    };
  } catch (error) {
    console.error("Error getting daily duel:", error);
    throw error;
  }
}

function ideaToObject(idea: any) {
  return {
    id: idea.id,
    title: idea.title,
    slogan: idea.slogan,
    description: idea.description,
    aiPromptId: idea.aiPromptId,
    aiPrompt: idea.aiPrompt,
    translations: idea.translations || [],
  };
}

function winnerToObject(idea: any) {
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
    const ideas = await prisma.idea.findMany({
      orderBy: {
        score: "desc",
      },
      take: limit,
      include: {
        translations: true,
      },
    });

    return ideas.map((idea, index: number) => ({
      rank: index + 1,
      id: idea.id,
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description,
      score: idea.score,
      aiPromptId: idea.aiPromptId,
      translations: idea.translations,
    }));
  } catch (error) {
    console.error("Error getting idea ranking:", error);
    throw error;
  }
}
