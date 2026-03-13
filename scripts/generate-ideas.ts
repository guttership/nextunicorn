import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

import { addDays, extractCategoryTags } from "../app/lib/idea-engine";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SAAS_PROMPTS = [
  "Generate a unique SaaS idea for remote team productivity",
  "Create an innovative SaaS tool for small e-commerce businesses",
  "Develop a SaaS solution for freelance project management",
  "Design a SaaS platform for content creators and streamers",
  "Build a SaaS tool for personal finance and investment tracking",
  "Create a SaaS solution for employee wellbeing and mental health",
  "Develop a SaaS platform for AI-powered customer support",
  "Design a SaaS tool for marketing automation and analytics",
  "Build a SaaS solution for sustainable business operations",
  "Create a SaaS platform for decentralized data storage",
];

async function generateIdeas() {
  console.log("🚀 Starting idea generation...");

  for (let i = 0; i < SAAS_PROMPTS.length; i++) {
    try {
      const prompt = SAAS_PROMPTS[i];
      console.log(`\n[${i + 1}/${SAAS_PROMPTS.length}] Generating idea: "${prompt}"`);

      const model = process.env.OPENAI_MODEL || "raptor-mini";
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: `${prompt}. Return ONLY a JSON object with: {"title": "...", "slogan": "...", "description": "... (max 50 chars)"}. Description must be very short, max 2 sentences.`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("❌ No content in response");
        continue;
      }

      const parsed = JSON.parse(content);

      const idea = await prisma.idea.create({
        data: {
          title: parsed.title,
          slogan: parsed.slogan,
          description: parsed.description,
          aiPrompt: prompt,
          aiPromptId: `prompt_${i}`,
          generatedAt: new Date(),
          isDaily: true,
          score: 0,
          origin: 'AI',
          status: 'ACTIVE',
          expiresAt: addDays(new Date(), 15),
          categoryTags: extractCategoryTags(parsed.title, parsed.slogan, parsed.description, prompt),
        },
      });

      console.log(`✅ Created: ${idea.title} (ID: ${idea.id})`);
    } catch (error) {
      console.error(`❌ Error generating idea ${i + 1}:`, error);
    }
  }

  console.log("\n✨ Idea generation complete!");
  await prisma.$disconnect();
}

generateIdeas().catch(console.error);
