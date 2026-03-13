"use server";

import { prisma } from "@/app/lib/db/prisma";
import { generateDailySaaSIdeas } from "@/app/lib/ai/gemini";
import { addDays, extractCategoryTags } from "@/app/lib/idea-engine";

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
            status: "ACTIVE",
            expiresAt: addDays(new Date(), 15),
            categoryTags: extractCategoryTags(idea.title, idea.slogan, idea.description, idea.description),
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
