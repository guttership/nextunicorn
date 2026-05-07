import OpenAI from 'openai';
import { areTitlesSimilar } from '@/app/lib/idea-engine';

export interface GeneratedIdea {
  title: string;
  slogan: string;
  description: string;
  aiPrompt: string;
  translations: {
    fr: { title: string; slogan: string; description: string; aiPrompt: string };
    de: { title: string; slogan: string; description: string; aiPrompt: string };
    es: { title: string; slogan: string; description: string; aiPrompt: string };
  };
}

const IDEA_GENERATION_PROMPT = `Generate exactly 10 SaaS startup ideas in plain language.

GOAL:
- Make each idea immediately understandable in under 5 seconds.
- Keep each description short and clear, never longer than 20 words.

MANDATORY RULES:
- No jargon, no buzzwords, no vague concepts.
- Focus on concrete pain points and obvious user value.
- Avoid saturated templates (to-do app, generic chatbot, habit app, meditation app, basic scheduler).
- Do not output developer-only or highly niche concepts.
- Keep title and slogan easy to read by non-technical founders.

Return JSON only in this exact shape:
{
  "ideas": [
    {
      "title": "2-4 words, simple",
      "slogan": "6-10 words, concrete value",
      "description": "Max 20 words. Problem + clear outcome.",
      "aiPrompt": "One-sentence usage scenario"
    }
  ]
}

Do not include markdown. Do not include extra keys.`;

const IDEA_GENERATION_PROMPT_B = `Generate exactly 10 SaaS startup ideas as JSON.

For each idea return:
- title (2-4 words)
- problem (1 sentence, plain language)
- target (who benefits)
- whyNow (1 sentence)
- aiPrompt (1 sentence, concrete scenario)

Rules:
- No jargon.
- No crowded cliches.
- Keep it understandable for founders and indie makers.
- Keep descriptions short in final output.

Return only JSON in this shape: {"ideas": [...]}.
`;

const PROMPT_VARIANT = (process.env.IDEA_PROMPT_VARIANT || 'A').toUpperCase();
const DESCRIPTION_MAX_WORDS = 20;

function trimToWords(input: string, maxWords: number) {
  const cleaned = (input || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const words = cleaned.split(" ");
  return words.length <= maxWords ? cleaned : words.slice(0, maxWords).join(" ");
}

function oneLine(input: string) {
  return (input || "").replace(/\s+/g, " ").replace(/[\n\r]+/g, " ").trim();
}

type RawGeneratedIdea = {
  title?: unknown;
  slogan?: unknown;
  problem?: unknown;
  description?: unknown;
  aiPrompt?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeGeneratedIdea(raw: RawGeneratedIdea) {
  const title = oneLine(asString(raw.title)).slice(0, 80);
  const slogan = oneLine(asString(raw.slogan) || asString(raw.problem) || title).slice(0, 140);
  const descriptionBase = asString(raw.description) || asString(raw.problem) || slogan;
  const description = trimToWords(oneLine(descriptionBase), DESCRIPTION_MAX_WORDS);
  const aiPrompt = oneLine(asString(raw.aiPrompt) || description || slogan).slice(0, 220);

  return { title, slogan, description, aiPrompt };
}

async function chatWithFallback(openai: OpenAI, messages: Array<{ role: "system" | "user"; content: string }>) {
  const preferredModel = process.env.OPENAI_MODEL;
  const candidates = Array.from(new Set([
    preferredModel,
    "gpt-5-mini",
    "gpt-4o-mini",
    "gpt-4-mini",
    "gpt-5-mini-2025-08-07",
  ].filter(Boolean) as string[]));

  let lastError: unknown;

  for (const model of candidates) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        response_format: { type: "json_object" },
      });
      return response;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (/model_not_found|not found/i.test(message)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

async function improveTranslations(openai: OpenAI, ideas: Array<{ title: string; slogan: string; description: string; aiPrompt: string }>) {
  const payload = ideas.map((idea, index) => ({ id: index, ...idea }));

  const translationPrompt = `You are a native localization expert for startup products.
Translate each item to fr, de, es with natural, idiomatic phrasing.

QUALITY RULES:
- Do NOT translate word-for-word.
- Keep startup/product tone clear and concise.
- Keep meaning identical to source.
- title: short and punchy
- slogan: clear value proposition
- description: max 20 words, same or shorter than source
- aiPrompt: realistic one-sentence scenario

Return JSON only in this exact shape:
{
  "translations": [
    {
      "id": 0,
      "fr": {"title":"...","slogan":"...","description":"...","aiPrompt":"..."},
      "de": {"title":"...","slogan":"...","description":"...","aiPrompt":"..."},
      "es": {"title":"...","slogan":"...","description":"...","aiPrompt":"..."}
    }
  ]
}

Source items:
${JSON.stringify(payload)}`;

  const response = await chatWithFallback(openai, [
    {
      role: "system",
      content: "You produce high-quality, natural translations for product copy.",
    },
    {
      role: "user",
      content: translationPrompt,
    },
  ]);

  const raw = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  const rows = Array.isArray(parsed?.translations) ? parsed.translations : [];

  type TranslationRow = {
    id?: unknown;
    fr?: Partial<Omit<GeneratedIdea, "translations">>;
    de?: Partial<Omit<GeneratedIdea, "translations">>;
    es?: Partial<Omit<GeneratedIdea, "translations">>;
  };

  const byId = new Map<number, TranslationRow>();
  for (const row of rows) {
    if (typeof row?.id === "number") {
      byId.set(row.id, row);
    }
  }

  return ideas.map((idea, index) => {
    const translated = byId.get(index) || {};

    const mapLocale = (locale: "fr" | "de" | "es") => {
      const src = translated?.[locale] || {};
      return {
        title: oneLine(src.title || idea.title),
        slogan: oneLine(src.slogan || idea.slogan),
        description: trimToWords(oneLine(src.description || idea.description), DESCRIPTION_MAX_WORDS),
        aiPrompt: oneLine(src.aiPrompt || idea.aiPrompt),
      };
    };

    return {
      fr: mapLocale("fr"),
      de: mapLocale("de"),
      es: mapLocale("es"),
    };
  });
}

// Filter new ideas that are too similar to existing ones or to each other
function deduplicateNewIdeas<T extends { title: string }>(
  ideas: T[],
  existingTitles: string[],
  threshold = 0.45
): T[] {
  // Remove ideas too similar to any existing DB title
  const filtered = ideas.filter(
    idea => !existingTitles.some(existing => areTitlesSimilar(idea.title, existing, threshold))
  );
  // Deduplicate within the batch (keep first occurrence of each similar group)
  const deduped: T[] = [];
  for (const idea of filtered) {
    if (!deduped.some(kept => areTitlesSimilar(idea.title, kept.title, threshold))) {
      deduped.push(idea);
    }
  }
  return deduped;
}

export async function generateDailySaaSIdeas(existingTitles: string[] = [], generationPrompt?: string): Promise<GeneratedIdea[]> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Add existing titles to avoid duplicates
    const existingContext = existingTitles.length > 0 
      ? `\n\nEXISTING IDEAS (generate completely different concepts):\n${existingTitles.map(t => `- ${t}`).join('\n')}\n`
      : '';
    
    const randomContext = `\n\nGeneration timestamp: ${Date.now()}. Focus on PROFITABLE, MONETIZABLE ideas with clear business models.${existingContext}`;
    
    const selectedPrompt = generationPrompt || (PROMPT_VARIANT === 'B' ? IDEA_GENERATION_PROMPT_B : IDEA_GENERATION_PROMPT);

    // OpenAI requires the word "json" in messages when using response_format json_object
    const promptWithJsonHint = selectedPrompt.toLowerCase().includes('json')
      ? selectedPrompt
      : selectedPrompt + '\n\nReturn your answer as JSON only.';

    const completion = await chatWithFallback(openai, [
      {
        role: "system",
        content: "You are a SaaS product strategist. Output clear, concrete, founder-friendly ideas in compact wording.",
      },
      {
        role: "user",
        content: promptWithJsonHint + randomContext,
      },
    ]);

    let text = completion.choices[0]?.message?.content || "";
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(text);
    const rawIdeas = parsed.ideas || parsed;

    if (!Array.isArray(rawIdeas) || rawIdeas.length < 2) {
      throw new Error(`Expected at least 2 ideas, got ${rawIdeas?.length ?? 0}`);
    }

    const normalizedIdeas = rawIdeas.map((raw, index) => {
      const converted = raw?.problem && !raw?.slogan
        ? {
            ...raw,
            slogan: raw.problem,
            description: raw.target ? `For ${raw.target}. ${raw.whyNow || ""}` : raw.problem,
          }
        : raw;

      const idea = normalizeGeneratedIdea(converted);

      if (!idea.title || !idea.aiPrompt) {
        throw new Error(`Idea ${index} is missing required fields (title or aiPrompt)`);
      }

      return idea;
    });

    // Remove ideas too similar to existing DB titles or to each other
    const dedupedIdeas = deduplicateNewIdeas(normalizedIdeas, existingTitles);
    if (dedupedIdeas.length < 2) {
      throw new Error(`After deduplication only ${dedupedIdeas.length} unique ideas remain`);
    }
    console.log(`[GEMINI] ${normalizedIdeas.length} ideas generated, ${dedupedIdeas.length} kept after dedup`);

    let translations;
    try {
      translations = await improveTranslations(openai, dedupedIdeas);
    } catch (translationError) {
      console.warn("Translation quality pass failed, using source fallback:", translationError);
      translations = dedupedIdeas.map((idea) => ({
        fr: { ...idea },
        de: { ...idea },
        es: { ...idea },
      }));
    }

    return dedupedIdeas.map((idea, index) => ({
      ...idea,
      translations: translations[index],
    }));
  } catch (error) {
    console.error("Error generating SaaS ideas:", error);
    throw error;
  }
}
