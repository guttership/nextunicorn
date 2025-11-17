import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";
import { generateDailySaaSIdeas } from "@/app/lib/gemini";

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

export async function GET(request: Request) {
  try {
    // Verify the request is from cron service
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily update...');
    const startTime = new Date();
    
    // Respond immediately to avoid timeout
    // The actual work continues in background
    const response = NextResponse.json({ 
      success: true,
      message: 'Daily update started',
      timestamp: startTime.toISOString()
    });

    // Continue processing in background (don't await)
    performDailyUpdate().catch(error => {
      console.error("Background daily update error:", error);
    });

    return response;

  } catch (error) {
    console.error("Daily update error:", error);
    const message = error instanceof Error ? error.message : "Failed to start update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function performDailyUpdate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Mark old champion as no longer champion
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
    console.log(`Champion updated: ${champion.title}`);
  }

  // 3. Get existing ideas to avoid duplicates
  const existingIdeas = await prisma.idea.findMany({
    select: { title: true }
  });
  const existingTitles = existingIdeas.map(i => i.title);

  // 4. Generate 10 new ideas
  console.log('Generating new ideas...');
  const newIdeas = await generateDailySaaSIdeas(existingTitles);
  console.log(`Generated ${newIdeas.length} new ideas`);

  // 5. Create ideas with translations
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

      return createdIdea;
    })
  );

  console.log(`Created ${createdIdeas.length} ideas with translations`);
  console.log(`Daily update completed successfully`);
}
