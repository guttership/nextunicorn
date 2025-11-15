import OpenAI from 'openai';

export interface GeneratedIdea {
  title: string;
  slogan: string;
  description: string;
  aiPrompt: string;
  translations: {
    fr: { slogan: string; description: string };
    de: { slogan: string; description: string };
    es: { slogan: string; description: string };
  };
}

const IDEA_GENERATION_PROMPT = `Generate 10 profitable and monetizable SaaS ideas for serious entrepreneurs.

CRITICAL REQUIREMENTS:
- Ideas MUST solve real pain points that people/businesses will PAY for
- Mix of B2B (70%) and B2C/prosumer (30%) opportunities
- Target specific niches with proven demand
- Ideas must be technically feasible and launchable
- Avoid saturated markets (no generic "social media for X" or obvious clones)

PRICING VALIDATION:
- Each idea should have clear monetization path (subscription, usage-based, freemium)
- B2B: $50/month minimum (no upper limit for enterprise solutions)
- B2C: $1-50/month (mass market apps can start at €1-2/month)
- Focus on productivity gains, time savings, or revenue generation for customers

Each idea:
{
  "title": "Professional name (max 3 words)",
  "slogan": "Clear value proposition in 6-8 words",
  "description": "Specific problem + solution (max 20 words, be concrete)",
  "aiPrompt": "Real use case scenario showing ROI (1 sentence)",
  "translations": {
    "fr": {"slogan": "French translation", "description": "French translation"},
    "de": {"slogan": "German translation", "description": "German translation"},
    "es": {"slogan": "Spanish translation", "description": "Spanish translation"}
  }
}

DIVERSE profitable niches to explore:
B2B: Developer tools, sales automation, practice management, legal tech, SMB finance, team collaboration, e-commerce ops, HR automation, customer support
B2C/Prosumer: Creator tools, personal finance, productivity apps, learning platforms, health tracking, side hustle enablers

Return ONLY: {"ideas": [10 objects]}`;

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
    
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
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
          fr: { slogan: idea.slogan, description: idea.description },
          de: { slogan: idea.slogan, description: idea.description },
          es: { slogan: idea.slogan, description: idea.description }
        };
      }
      // Validate each translation has required fields
      ['fr', 'de', 'es'].forEach(lang => {
        if (!idea.translations[lang]) {
          idea.translations[lang] = { slogan: idea.slogan, description: idea.description };
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
