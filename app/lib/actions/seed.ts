"use server";

import { prisma } from "@/app/lib/db/prisma";
import { generateDailySaaSIdeas } from "@/app/lib/ai/gemini";

export async function seedDailyIdeas() {
  try {
    // Check if we have ideas for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingIdeas = await prisma.idea.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    if (existingIdeas.length >= 10) {
      console.log("Ideas for today already exist");
      return existingIdeas;
    }

    // Generate new ideas
    console.log("Generating new SaaS ideas...");
    const newIdeas = await generateDailySaaSIdeas(10);

    // Save to database
    const createdIdeas = await Promise.all(
      newIdeas.map((idea: { title: string; slogan: string; description: string; aiPromptId: string }) =>
        prisma.idea.create({
          data: {
            title: idea.title,
            slogan: idea.slogan,
            description: idea.description,
            aiPrompt: idea.description, // Use description as aiPrompt for now
            aiPromptId: idea.aiPromptId,
            isDaily: true,
          },
        })
      )
    );

    console.log(`Created ${createdIdeas.length} new ideas`);
    return createdIdeas;
  } catch (error) {
    console.error("Error seeding ideas:", error);
    throw error;
  }
}
