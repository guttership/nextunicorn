import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getDailyDuel } = await import("@/app/lib/actions/duel");
    const duel = await getDailyDuel();
    return NextResponse.json(duel);
  } catch (error) {
    console.error("Duel error:", error);
    const message = error instanceof Error ? error.message : "Failed to get duel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
