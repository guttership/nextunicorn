import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";
import { generateDailySaaSIdeas } from "@/app/lib/gemini";

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

export async function GET(request: Request) {
  try {
    console.log('[CRON] Starting daily update...');
    const startTime = Date.now();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Mark old champion as no longer champion
    console.log('[CRON] Updating champions...');
    await prisma.idea.updateMany({
      where: { isChampion: true },
      data: { isChampion: false },
    });

    // 2. Find yesterday's top idea and make it today's champion
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

    if (champion) {
      await prisma.idea.update({
        where: { id: champion.id },
        data: { 
          isChampion: true, 
          generatedAt: today 
        },
      });
      console.log(`[CRON] Champion updated: ${champion.title}`);
    } else {
      console.log('[CRON] No champion found from yesterday');
    }

    // 3. Get existing ideas to avoid duplicates
    console.log('[CRON] Fetching existing ideas...');
    const existingIdeas = await prisma.idea.findMany({
      select: { title: true }
    });
    const existingTitles = existingIdeas.map(i => i.title);
    console.log(`[CRON] Found ${existingTitles.length} existing ideas`);

    // 4. Generate 10 new ideas
    console.log('[CRON] Calling OpenAI to generate new ideas...');
    const newIdeas = await generateDailySaaSIdeas(existingTitles);
    console.log(`[CRON] Generated ${newIdeas.length} new ideas from OpenAI`);

    // 5. Create ideas with translations
    console.log('[CRON] Saving ideas to database...');
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
              title: idea.translations.fr.title,
              slogan: idea.translations.fr.slogan,
              description: idea.translations.fr.description,
              aiPrompt: idea.translations.fr.aiPrompt,
            },
          }),
          prisma.ideaTranslation.create({
            data: {
              ideaId: createdIdea.id,
              language: 'de',
              title: idea.translations.de.title,
              slogan: idea.translations.de.slogan,
              description: idea.translations.de.description,
              aiPrompt: idea.translations.de.aiPrompt,
            },
          }),
          prisma.ideaTranslation.create({
            data: {
              ideaId: createdIdea.id,
              language: 'es',
              title: idea.translations.es.title,
              slogan: idea.translations.es.slogan,
              description: idea.translations.es.description,
              aiPrompt: idea.translations.es.aiPrompt,
            },
          }),
        ]);

        console.log(`[CRON] Created idea: ${idea.title}`);
        return createdIdea;
      })
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[CRON] ✅ Daily update completed successfully!`);
    console.log(`[CRON] - Champion: ${champion?.title || 'none'}`);
    console.log(`[CRON] - Ideas created: ${createdIdeas.length}`);
    console.log(`[CRON] - Duration: ${duration}s`);

    return NextResponse.json({ 
      success: true,
      champion: champion?.title || 'none',
      ideasGenerated: createdIdeas.length,
      timestamp: new Date().toISOString(),
      duration: `${duration}s`
    });

  } catch (error) {
    console.error("[CRON] Daily update error:", error);
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
