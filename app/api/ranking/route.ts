import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { getIdeaRanking } = await import("@/app/lib/actions/duel");
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const ranking = await getIdeaRanking(limit);
    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Ranking error:", error);
    const message = error instanceof Error ? error.message : "Failed to get ranking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
