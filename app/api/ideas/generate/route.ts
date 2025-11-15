import { NextResponse } from "next/server";
import { generateDailySaaSIdeas } from "@/app/lib/gemini";
import { prisma } from "@/app/lib/db/prisma";

export async function POST() {
  try {
    // Get existing ideas to avoid duplicates
    const existingIdeas = await prisma.idea.findMany({
      select: { title: true, slogan: true }
    });
    
    const existingTitles = existingIdeas.map(i => i.title);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find yesterday's champion (if any existed before deletion)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const champion = await prisma.idea.findFirst({
      where: {
        generatedAt: {
          gte: yesterday,
          lt: today,
        },
      },
      orderBy: {
        score: "desc",
      },
    });

    // Mark old champion as no longer champion
    await prisma.idea.updateMany({
      where: { isChampion: true },
      data: { isChampion: false },
    });

    // If there was a champion, keep it for today's battle
    if (champion) {
      await prisma.idea.update({
        where: { id: champion.id },
        data: { isChampion: true, generatedAt: today },
      });
    }

    // Generate 10 new ideas from OpenAI (avoiding duplicates)
    const newIdeas = await generateDailySaaSIdeas(existingTitles);

    // Create ideas with translations
    const createdIdeas = await Promise.all(
      newIdeas.map(async (idea, index) => {
        const createdIdea = await prisma.idea.create({
          data: {
            title: idea.title,
            slogan: idea.slogan,
            description: idea.description,
            aiPrompt: idea.aiPrompt,
            aiPromptId: `generated_${Date.now()}_${index}`,
            generatedAt: today,
            score: 0,
            isDaily: true,
          },
        });

        // Create translations for each language
        await Promise.all([
          prisma.ideaTranslation.create({
            data: {
              ideaId: createdIdea.id,
              language: 'fr',
              slogan: idea.translations.fr.slogan,
              description: idea.translations.fr.description,
            },
          }),
          prisma.ideaTranslation.create({
            data: {
              ideaId: createdIdea.id,
              language: 'de',
              slogan: idea.translations.de.slogan,
              description: idea.translations.de.description,
            },
          }),
          prisma.ideaTranslation.create({
            data: {
              ideaId: createdIdea.id,
              language: 'es',
              slogan: idea.translations.es.slogan,
              description: idea.translations.es.description,
            },
          }),
        ]);

        return createdIdea;
      })
    );

    return NextResponse.json(
      {
        message: "Ideas generated successfully",
        championId: champion?.id,
        newIdeasCount: createdIdeas.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in idea generation:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
