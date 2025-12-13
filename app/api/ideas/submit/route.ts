import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supportedLanguages } from "@/app/lib/i18n";
import OpenAI from "openai";

const prisma = new PrismaClient();

// Rate limiting for submissions (stricter than votes)
const submitRateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3; // Max 3 submissions per hour per IP

function isSubmitRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = submitRateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    submitRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input sanitization
function sanitizeInput(str: string, maxLength: number): string {
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>\"\'`;]/g, ""); // Remove potential injection chars
}

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

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Check rate limit
    if (isSubmitRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait an hour before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    let { title, slogan, description, audience } = body;
    // audience optional; expected values could be 'indie-dev', 'b2b', 'developer', etc.
    audience = audience ? sanitizeInput(String(audience), 50) : null;

    if (!title || !slogan || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sanitize and validate inputs
    title = sanitizeInput(title, 100);
    slogan = sanitizeInput(slogan, 200);
    description = sanitizeInput(description, 1000);

    if (title.length < 3 || slogan.length < 5 || description.length < 20) {
      return NextResponse.json({ error: "Content too short" }, { status: 400 });
    }

    // AI Moderation (skip gracefully if OpenAI isn't configured or fails)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "raptor-mini";

    let moderation: { approved: boolean; aiPrompt?: string; reason?: string } = { approved: true, aiPrompt: "" };
    if (process.env.OPENAI_API_KEY) {
      try {
        const moderationResponse = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: MODERATION_PROMPT },
            {
              role: "user",
              content: `Title: ${title}\nSlogan: ${slogan}\nDescription: ${description}`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const moderationResult = JSON.parse(moderationResponse.choices[0].message.content || "{}");
        moderation = { approved: !!moderationResult.approved, aiPrompt: moderationResult.aiPrompt || "", reason: moderationResult.reason };
      } catch (mErr) {
        console.warn("Moderation error, proceeding without AI moderation:", mErr);
        moderation = { approved: true, aiPrompt: "" };
      }
    } else {
      console.warn("OPENAI_API_KEY not set, skipping AI moderation and translation");
      moderation = { approved: true, aiPrompt: "" };
    }

    if (!moderation.approved) {
      return NextResponse.json({ error: `Idea rejected: ${moderation.reason}` }, { status: 400 });
    }

    // Auto-translate with AI for configured languages (excluding English)
    const targetLangs = supportedLanguages.filter((l) => l !== "en");
    const translationPromptLangs = targetLangs.map((l) => `"${l}"`).join(", ");
    const translationPrompt = `Translate the provided title, slogan and description into JSON for the following languages: [${translationPromptLangs}].\n\nReturn JSON in the form:\n{ "fr": {"title":"..","slogan":"..","description":"..","aiPrompt":".."}, ... }\n\nOriginal:\nTitle: ${title}\nSlogan: ${slogan}\nDescription: ${description}`;

    let translations: Record<string, any> = {};
    try {
      const translationResponse = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: translationPrompt }],
        response_format: { type: "json_object" },
      });
      translations = JSON.parse(translationResponse.choices[0].message.content || "{}");
    } catch (tErr) {
      console.warn("Translation generation failed, continuing without translations:", tErr);
      translations = {};
    }

    // Save to database
    const idea = await prisma.idea.create({
      data: {
        title,
        slogan,
        description,
        aiPrompt: moderation.aiPrompt || "",
        aiPromptId: `user-${Date.now()}`,
        isDaily: false,
        score: 0,
        origin: 'COMMUNITY',
        audience,
      },
    });

    // Save translations for supported languages (excluding English)
    for (const lang of targetLangs) {
      try {
        await prisma.ideaTranslation.create({
          data: {
            ideaId: idea.id,
            language: lang,
            title: translations[lang]?.title || title,
            slogan: translations[lang]?.slogan || slogan,
            description: translations[lang]?.description || description,
            aiPrompt: translations[lang]?.aiPrompt || moderation.aiPrompt || "",
          },
        });
      } catch (createErr) {
        // Log but don't stop the entire submission
        console.warn(`Failed to save translation for ${lang}:`, createErr);
      }
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
