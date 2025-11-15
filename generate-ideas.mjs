import "dotenv/config.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { OpenRouter } from "@openrouter/sdk";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    process.env[key.trim()] = value.replace(/"/g, "");
  }
});

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "NextUnicorn",
  },
});

const prisma = new PrismaClient();

const IDEA_GENERATION_PROMPT = `You are a creative SaaS idea generator. Generate exactly 10 innovative SaaS (Software as a Service) business ideas.

For EACH idea, provide a JSON object with these exact fields:
{
  "title": "The SaaS product name (short and catchy)",
  "slogan": "One-liner tagline (10-15 words max)",
  "description": "A clear, accessible explanation of what it does (2-3 sentences, NO jargon)",
  "aiPrompt": "The human-friendly 'imagine' scenario that inspired this idea (start with 'Imagine' or 'What if')"
}

Return a JSON array with exactly 10 objects. Make sure descriptions are easy to understand - avoid technical jargon. Make ideas practical and solvable, not sci-fi.

Important: Return ONLY valid JSON array, no markdown, no extra text.`;

async function generateIdeas() {
  console.log('🦄 Generating ideas with OpenRouter...');
  
  try {
    const response = await openRouter.chat.send({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: IDEA_GENERATION_PROMPT,
        },
      ],
      stream: false,
    });

    console.log('📝 Response received, parsing...');
    
    const text = response.choices[0].message.content;
    const ideas = JSON.parse(text);

    if (!Array.isArray(ideas) || ideas.length !== 10) {
      throw new Error(`Expected 10 ideas, got ${ideas.length}`);
    }

    // Validate and create in database
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('💾 Saving to database...');
    
    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      
      if (!idea.title || !idea.slogan || !idea.description || !idea.aiPrompt) {
        console.error(`Idea ${i} missing fields:`, idea);
        continue;
      }

      await prisma.idea.create({
        data: {
          title: idea.title,
          slogan: idea.slogan,
          description: idea.description,
          aiPrompt: idea.aiPrompt,
          aiPromptId: `idea-${i + 1}`,
          generatedAt: today,
          isChampion: false,
          score: 0,
        },
      });
      
      console.log(`✓ Idea ${i + 1}: ${idea.title}`);
    }

    console.log('\n✅ All ideas generated and saved!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateIdeas();
