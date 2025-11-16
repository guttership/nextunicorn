import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";

export async function POST() {
  try {
    // Delete all votes first (foreign key constraint)
    await prisma.vote.deleteMany({});
    
    // Delete all idea translations
    await prisma.ideaTranslation.deleteMany({});
    
    // Delete all ideas
    await prisma.idea.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "All ideas cleared successfully" 
    });
  } catch (error) {
    console.error("Error clearing ideas:", error);
    const message = error instanceof Error ? error.message : "Failed to clear ideas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
