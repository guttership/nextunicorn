import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

const MODERATION_PROMPT = `You are a content moderator for a SaaS ideas platform. Analyze this user-submitted idea and determine:

1. Is it appropriate? (no spam, hate speech, or irrelevant content)
2. Is it a genuine SaaS idea? (not just random text)
3. Does it have potential value for entrepreneurs/developers?
4. Generate an "Imagine" prompt based on the idea (1 sentence starting with "Imagine")

Return JSON:
{
  "approved": true/false,
  "reason": "brief explanation if rejected",
  "aiPrompt": "Imagine scenario if approved, empty string if rejected",
  "category": "one of: tech, health, finance, education, marketing, other"
}`;

export async function POST(request: Request) {
  try {
    const { title, slogan, description } = await request.json();

    if (!title || !slogan || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // AI Moderation
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const model = process.env.OPENAI_MODEL || "raptor-mini";

    const moderationResponse = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: MODERATION_PROMPT },
        { 
          role: "user", 
          content: `Title: ${title}\nSlogan: ${slogan}\nDescription: ${description}` 
        }
      ],
      response_format: { type: "json_object" }
    });

    const moderation = JSON.parse(moderationResponse.choices[0].message.content || "{}");

    if (!moderation.approved) {
      return NextResponse.json({ 
        error: `Idea rejected: ${moderation.reason}` 
      }, { status: 400 });
    }

    // Auto-translate with AI
    const translationResponse = await openai.chat.completions.create({
      model,
      messages: [
        { 
          role: "user", 
          content: `Translate to JSON:
{
  "fr": {"slogan": "French translation of: ${slogan}", "description": "French translation of: ${description}"},
  "de": {"slogan": "German translation of: ${slogan}", "description": "German translation of: ${description}"},
  "es": {"slogan": "Spanish translation of: ${slogan}", "description": "Spanish translation of: ${description}"}
}` 
        }
      ],
      response_format: { type: "json_object" }
    });

    const translations = JSON.parse(translationResponse.choices[0].message.content || "{}");

    // Save to database
    const idea = await prisma.idea.create({
      data: {
        title,
        slogan,
        description,
        aiPrompt: moderation.aiPrompt,
        aiPromptId: `user-${Date.now()}`,
        isDaily: false,
        score: 0,
      },
    });

    // Save translations
    for (const lang of ["fr", "de", "es"]) {
      await prisma.ideaTranslation.create({
        data: {
          ideaId: idea.id,
          language: lang,
          title: translations[lang]?.title || title,
          slogan: translations[lang]?.slogan || slogan,
          description: translations[lang]?.description || description,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      ideaId: idea.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting idea:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
