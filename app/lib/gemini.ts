import OpenAI from 'openai';

export interface GeneratedIdea {
  title: string;
  slogan: string;
  description: string;
  aiPrompt: string;
  translations: {
    fr: { title: string; slogan: string; description: string };
    de: { title: string; slogan: string; description: string };
    es: { title: string; slogan: string; description: string };
  };
}

const IDEA_GENERATION_PROMPT = `Generate 10 profitable and monetizable SaaS ideas that ANYONE can understand.

CRITICAL REQUIREMENTS:
- Ideas MUST be IMMEDIATELY understandable by the general public (no jargon!)
- Solve OBVIOUS everyday problems that everyone faces or can relate to
- Clear, visible value proposition that makes sense in 5 seconds
- Mix of B2B (50%) and B2C (50%) - all must be easy to grasp
- Avoid technical niches, developer tools, or industry-specific solutions
- NO buzzwords, NO complex terminology, NO niche markets

CLARITY OVER COMPLEXITY:
- If you need to explain what industry/sector it's for, it's TOO NICHE
- Examples of GOOD (clear): "Automated receipt tracking", "Video meeting scheduler", "Password manager for families"
- Examples of BAD (too niche): "API testing suite", "Kubernetes monitoring", "Legal practice management"

UNIVERSAL PROBLEMS TO SOLVE:
- Time management & productivity (scheduling, reminders, to-do lists)
- Money management (budgets, expense tracking, invoicing)
- Communication (email, messaging, video calls)
- Content creation (writing, design, video editing)
- Learning & education (courses, tutorials, skill building)
- Health & wellness (fitness, meal planning, sleep tracking)
- Home & family (shopping lists, chores, family calendar)
- Small business basics (invoicing, CRM, bookkeeping)

PRICING VALIDATION:
- B2B: €10-100/month for small businesses
- B2C: €3-15/month for individuals/families
- Focus on OBVIOUS value: save time, save money, make money, reduce stress

IMPORTANT: Return your response in JSON format with the following structure:

Each idea:
{
  "title": "Simple, clear name (2-3 words max, NO jargon)",
  "slogan": "What it does in plain language (6-8 words)",
  "description": "The problem + how it helps (max 20 words, conversational tone)",
  "aiPrompt": "Concrete example anyone can relate to (1 sentence)",
  "translations": {
    "fr": {"title": "French title", "slogan": "French translation", "description": "French translation"},
    "de": {"title": "German title", "slogan": "German translation", "description": "German translation"},
    "es": {"title": "Spanish title", "slogan": "Spanish translation", "description": "Spanish translation"}
  }
}

Return ONLY valid JSON: {"ideas": [10 objects]}`;

export async function generateDailySaaSIdeas(existingTitles: string[] = []): Promise<GeneratedIdea[]> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Add existing titles to avoid duplicates
    const existingContext = existingTitles.length > 0 
      ? `\n\nEXISTING IDEAS (generate completely different concepts):\n${existingTitles.map(t => `- ${t}`).join('\n')}\n`
      : '';
    
    const randomContext = `\n\nGeneration timestamp: ${Date.now()}. Focus on PROFITABLE, MONETIZABLE ideas with clear business models.${existingContext}`;
    
    const model = process.env.OPENAI_MODEL || "gpt-5-mini-2025-08-07";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a successful SaaS entrepreneur and investor. You only suggest ideas with proven market demand and clear paths to profitability."
        },
        {
          role: "user",
          content: IDEA_GENERATION_PROMPT + randomContext
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log("OpenAI raw response:", JSON.stringify(completion, null, 2));
    
    let text = completion.choices[0]?.message?.content || "";
    
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    const parsed = JSON.parse(text);
    const ideas = parsed.ideas || parsed;

    if (!Array.isArray(ideas) || ideas.length < 2) {
      throw new Error(`Expected at least 2 ideas, got ${ideas.length}`);
    }

    // Validate each idea has required fields
    ideas.forEach((idea, index) => {
      if (!idea.title || !idea.slogan || !idea.description || !idea.aiPrompt) {
        throw new Error(`Idea ${index} is missing required fields`);
      }
      // Ensure translations exist with default values if missing
      if (!idea.translations) {
        idea.translations = {
          fr: { title: idea.title, slogan: idea.slogan, description: idea.description },
          de: { title: idea.title, slogan: idea.slogan, description: idea.description },
          es: { title: idea.title, slogan: idea.slogan, description: idea.description }
        };
      }
      // Validate each translation has required fields
      ['fr', 'de', 'es'].forEach(lang => {
        if (!idea.translations[lang]) {
          idea.translations[lang] = { title: idea.title, slogan: idea.slogan, description: idea.description };
        }
        if (!idea.translations[lang].title) {
          idea.translations[lang].title = idea.title;
        }
        if (!idea.translations[lang].slogan) {
          idea.translations[lang].slogan = idea.slogan;
        }
        if (!idea.translations[lang].description) {
          idea.translations[lang].description = idea.description;
        }
      });
    });

    return ideas;
  } catch (error) {
    console.error("Error generating SaaS ideas:", error);
    throw error;
  }
}
