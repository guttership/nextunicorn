import { NextRequest, NextResponse } from "next/server";
import { deduplicateSimilarIdeas } from "@/app/lib/idea-engine";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/deduplicate
 * Triggers a similarity-based deduplication pass over all active ideas.
 * Ideas with similar titles are compared; the one with fewer votes is archived.
 *
 * Optional query param: threshold (default 0.45, range 0.0–1.0)
 * Lower = stricter (fewer archivals), higher = more aggressive.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const threshold = parseFloat(searchParams.get("threshold") ?? "0.45");

  if (isNaN(threshold) || threshold < 0.1 || threshold > 1.0) {
    return NextResponse.json({ error: "Invalid threshold (0.1–1.0)" }, { status: 400 });
  }

  try {
    const result = await deduplicateSimilarIdeas(threshold);
    return NextResponse.json({
      success: true,
      threshold,
      archived: result.archived,
      kept: result.kept,
      pairs: result.pairs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
