import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supportedLanguages } from "@/app/lib/i18n";
import { addDays, extractCategoryTags } from "@/app/lib/idea-engine";
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
    const preferredModel = process.env.OPENAI_MODEL;
    const modelCandidates = [preferredModel, "gpt-5-mini", "gpt-4o-mini", "gpt-4-mini"].filter(Boolean) as string[];

    type ChatCreateParams = Parameters<typeof openai.chat.completions.create>[0];
    async function callChatWithFallback(opts: { messages: ChatCreateParams["messages"]; response_format?: ChatCreateParams["response_format"] }) {
      let lastErr: unknown;
      for (const candidate of modelCandidates) {
        try {
          console.log(`Trying model: ${candidate}`);
          const resp = await openai.chat.completions.create({ model: candidate, messages: opts.messages, response_format: opts.response_format || { type: "json_object" } });
          console.log(`Model ${candidate} succeeded`);
          // attach used model for debugging
          return { response: resp, model: candidate };
        } catch (err) {
          lastErr = err;
          // If OpenAI returns model_not_found, try next candidate
          const maybeError = err as { code?: unknown; status?: unknown; response?: { status?: unknown }; message?: unknown };
          const code = maybeError.code || maybeError.status || maybeError.response?.status;
          const message = String(maybeError.message || "");
          if (message?.includes("model_not_found") || code === 404 || /model .* not found/i.test(message)) {
            console.warn(`Model ${candidate} not available, trying next candidate`);
            continue;
          }
          // For other errors, rethrow
          throw err;
        }
      }
      console.warn("All models failed for chat call", { lastErr });
      throw lastErr;
    }

    let moderation: { approved: boolean; aiPrompt?: string; reason?: string } = { approved: true, aiPrompt: "" };
    if (process.env.OPENAI_API_KEY) {
      try {
        const { response: moderationResponse, model: moderationModel } = await callChatWithFallback({
          messages: [
            { role: "system", content: MODERATION_PROMPT },
            { role: "user", content: `Title: ${title}\nSlogan: ${slogan}\nDescription: ${description}` },
          ],
        });
        console.log("Moderation model used:", moderationModel);
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

    type TranslationValue = {
      title?: string;
      slogan?: string;
      description?: string;
      aiPrompt?: string;
    };
    let translations: Record<string, TranslationValue> = {};
    try {
      console.log("Requesting translations");
      const { response: translationResponse, model: translationModel } = await callChatWithFallback({ messages: [{ role: "user", content: translationPrompt }], response_format: { type: "json_object" } });
      console.log("Translation model used:", translationModel);
      const content = translationResponse.choices?.[0]?.message?.content;
      console.log("Translation raw response:", content);
      translations = typeof content === "string" ? JSON.parse(content || "{}") : {};
      console.log("Parsed translations keys:", Object.keys(translations));
      // Normalize keys like 'fr-FR' -> 'fr'
      for (const key of Object.keys(translations)) {
        const short = key.split("-")[0];
        if (!translations[short]) translations[short] = translations[key];
      }
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
        status: 'ACTIVE',
        expiresAt: addDays(new Date(), 15),
        categoryTags: extractCategoryTags(title, slogan, description, moderation.aiPrompt || "", audience || ""),
      },
    });

    // Save translations for supported languages (excluding English)
    for (const lang of targetLangs) {
      try {
        await prisma.ideaTranslation.create({
          data: {
            ideaId: idea.id,
            language: lang,
            title: translations[lang]?.title || translations[lang]?.title || title,
            slogan: translations[lang]?.slogan || translations[lang]?.slogan || slogan,
            description: translations[lang]?.description || translations[lang]?.description || description,
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
