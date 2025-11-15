import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { seedDailyIdeas } = await import("@/app/lib/actions/seed");
    const ideas = await seedDailyIdeas();
    return NextResponse.json({
      success: true,
      message: "Ideas seeded successfully",
      count: ideas.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed ideas" },
      { status: 500 }
    );
  }
}
