import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { handleVote } = await import("@/app/lib/actions/duel");
    const body = await request.json();
    const { winnerId, loserId, voterId } = body;

    if (!winnerId || !loserId || !voterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await handleVote(winnerId, loserId, voterId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Vote error:", error);
    const message = error instanceof Error ? error.message : "Failed to process vote";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
