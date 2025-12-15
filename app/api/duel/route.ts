import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { getDailyDuel } = await import("@/app/lib/actions/duel");

    const url = new URL(request.url);
    const exclude = url.searchParams.get("exclude");
    const excludeOpponent = url.searchParams.get("excludeOpponent");
    const voterId = url.searchParams.get("voterId");

    const duel = await getDailyDuel(
      exclude ? Number(exclude) : undefined,
      voterId ?? undefined,
      excludeOpponent ? Number(excludeOpponent) : undefined
    );

    return NextResponse.json(duel);
  } catch (error) {
    console.error("Duel error:", error);
    const message = error instanceof Error ? error.message : "Failed to get duel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
