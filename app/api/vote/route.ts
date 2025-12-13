import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple in-memory rate limiting (resets on server restart)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_VOTES_PER_WINDOW = 30; // Max 30 votes per minute per IP

// Community validation constants (env-overridable)
const COMMUNITY_VALIDATION_VOTES_THRESHOLD = parseInt(process.env.COMMUNITY_VALIDATION_VOTES_THRESHOLD || "50");
const COMMUNITY_VALIDATION_WINDOW_DAYS = parseInt(process.env.COMMUNITY_VALIDATION_WINDOW_DAYS || "30");

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_VOTES_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many votes. Please slow down." },
        { status: 429 }
      );
    }

    const { handleVote } = await import("@/app/lib/actions/duel");
    const body = await request.json();
    const { winnerId, loserId, voterId } = body;

    // Validate required fields
    if (!winnerId || !loserId || !voterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate voterId format (must be valid UUID)
    if (!isValidUUID(voterId)) {
      return NextResponse.json(
        { error: "Invalid voter ID format" },
        { status: 400 }
      );
    }

    // Validate idea IDs are positive integers
    if (!Number.isInteger(winnerId) || winnerId < 1 ||
        !Number.isInteger(loserId) || loserId < 1) {
      return NextResponse.json(
        { error: "Invalid idea ID format" },
        { status: 400 }
      );
    }

    const result = await handleVote(winnerId, loserId, voterId);

    // After vote, check for community validation threshold
    try {
      const winner = await prisma.idea.findUnique({ where: { id: winnerId } });
      if (winner && winner.origin === "COMMUNITY" && !winner.isCommunityValidated) {
        const windowStart = new Date();
        windowStart.setDate(windowStart.getDate() - COMMUNITY_VALIDATION_WINDOW_DAYS);

        const votesCount = await prisma.vote.count({
          where: {
            createdAt: { gte: windowStart },
            OR: [
              { winnerIdeaId: winnerId },
              { loserIdeaId: winnerId },
            ],
          },
        });

        if (votesCount >= COMMUNITY_VALIDATION_VOTES_THRESHOLD) {
          await prisma.idea.update({
            where: { id: winnerId },
            data: {
              isCommunityValidated: true,
              communityValidatedAt: new Date(),
            },
          });
        }
      }
    } catch (err) {
      console.error("Community validation check failed:", err);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Vote error:", error);
    const message = error instanceof Error ? error.message : "Failed to process vote";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
