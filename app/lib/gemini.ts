import OpenAI from 'openai';

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

const IDEA_GENERATION_PROMPT = `Generate 10 profitable and monetizable SaaS ideas that ANYONE can understand.

CRITICAL REQUIREMENTS:
- Ideas MUST be IMMEDIATELY understandable by the general public (no jargon!)
- Solve OBVIOUS everyday problems that everyone faces or can relate to
- Clear, visible value proposition that makes sense in 5 seconds
- Mix of B2B (50%) and B2C (50%) - all must be easy to grasp
- Avoid technical niches, developer tools, or industry-specific solutions
- NO buzzwords, NO complex terminology, NO niche markets

ORIGINALITY IS KEY:
- AVOID common SaaS clichés: NO password managers, NO to-do apps, NO email tools
- AVOID saturated markets: NO meditation apps, NO habit trackers, NO generic schedulers
- AVOID obvious AI wrappers: NO "AI assistant for X", NO "chatbot for Y"
- Think FRESH angles on real problems - what hasn't been done yet?
- Look for EMERGING needs, not crowded spaces

CLARITY OVER COMPLEXITY:
- If you need to explain what industry/sector it's for, it's TOO NICHE

IMPORTANT: Return your response in JSON format with the following structure:

Each idea:
{
  "title": "Simple, clear name (2-3 words max, NO jargon)",
  "slogan": "What it does in plain language (6-8 words)",
  "description": "The problem + how it helps (max 20 words, conversational tone)",
  "aiPrompt": "Concrete example anyone can relate to (1 sentence)",
  "translations": {
    "fr": {"title": "French title", "slogan": "French translation", "description": "French translation", "aiPrompt": "French example"},
    "de": {"title": "German title", "slogan": "German translation", "description": "German translation", "aiPrompt": "German example"},
    "es": {"title": "Spanish title", "slogan": "Spanish translation", "description": "Spanish translation", "aiPrompt": "Spanish example"}
  }
}

Return ONLY valid JSON: {"ideas": [10 objects]}`;

// New, improved prompt (variant B) — more structured, action-focused and validation-oriented
const IDEA_GENERATION_PROMPT_B = `Generate 10 original SaaS ideas in JSON. For each idea return the following fields:

- title: short name (<=6 words, no jargon)
- problem: one-sentence problem statement in plain language
- target: who benefits (e.g. "freelancers who invoice manually")
- whyNow: one line why this is timely
- features: array of top 3 features (short phrases)
- mvpSteps: array of 3 actionable MVP steps (each 1 sentence)
- estTimeHours: estimated dev time for MVP (number)
- validationTests: array of 3 low-cost validation tests (each 1 sentence)
- aiPrompt: one-sentence concrete example anyone can relate to
- translations: { fr, de, es } with title, slogan, description, aiPrompt (fallback to English if unclear)

REQUIREMENTS:
- Use plain language, avoid buzzwords and jargon
- No password managers, to-do apps, meditation apps, or crowded categories
- Prefer ideas that are easy to validate and build an MVP for in under 100 hours
- Provide JSON only — exact structure: {"ideas": [ ... ]}

Example item (JSON):
{
  "title": "QuickSplit",
  "problem": "People struggle to split group bills from photos",
  "target": "friends & families",
  "whyNow": "more digital payments and social spending",
  "features": ["Photo bill parsing","Auto-split suggestions","One-click payment links"],
  "mvpSteps": ["Parse bill from image","Compute shares","Send payment links"],
  "estTimeHours": 40,
  "validationTests": ["Post idea on subreddit","Run 5 user interviews","Collect 50 email signups via landing page"],
  "aiPrompt": "Take a photo of a pizza receipt and split by items",
  "translations": {"fr": {"title":"PartageFacture","slogan":"Partager l'addition en un clic","description":"Prendre une photo d'une facture, la diviser et payer","aiPrompt":"Prendre une photo de l'addition et diviser"},"de": {...},"es": {...}}
}
`;

const PROMPT_VARIANT = (process.env.IDEA_PROMPT_VARIANT || 'A').toUpperCase();

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

    const selectedPrompt = PROMPT_VARIANT === 'B' ? IDEA_GENERATION_PROMPT_B : IDEA_GENERATION_PROMPT;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a successful SaaS entrepreneur and investor. You only suggest ideas with proven market demand and clear paths to profitability."
        },
        {
          role: "user",
          content: selectedPrompt + randomContext
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
      if (!idea.title || !idea.aiPrompt) {
        throw new Error(`Idea ${index} is missing required fields (title or aiPrompt)`);
      }
      
      // Convert prompt B format to prompt A format if needed
      if (idea.problem && !idea.slogan) {
        // Prompt B format detected - convert to prompt A
        idea.slogan = idea.problem; // Use problem as slogan
        idea.description = idea.target ? `For ${idea.target}. ${idea.whyNow || ''}` : idea.problem;
      }
      
      // Ensure slogan and description exist
      if (!idea.slogan) {
        idea.slogan = idea.title;
      }
      if (!idea.description) {
        idea.description = idea.slogan;
      }
      
      // Ensure translations exist with default values if missing
      if (!idea.translations) {
        idea.translations = {
          fr: { title: idea.title, slogan: idea.slogan, description: idea.description, aiPrompt: idea.aiPrompt },
          de: { title: idea.title, slogan: idea.slogan, description: idea.description, aiPrompt: idea.aiPrompt },
          es: { title: idea.title, slogan: idea.slogan, description: idea.description, aiPrompt: idea.aiPrompt }
        };
      }
      // Validate each translation has required fields
      ['fr', 'de', 'es'].forEach(lang => {
        if (!idea.translations[lang]) {
          idea.translations[lang] = { title: idea.title, slogan: idea.slogan, description: idea.description, aiPrompt: idea.aiPrompt };
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
        if (!idea.translations[lang].aiPrompt) {
          idea.translations[lang].aiPrompt = idea.aiPrompt;
        }
      });
    });

    return ideas;
  } catch (error) {
    console.error("Error generating SaaS ideas:", error);
    throw error;
  }
}
