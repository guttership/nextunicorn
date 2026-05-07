const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();

const SUPPORTED_LANGS = ['fr', 'de', 'es']; // english is source
const modelCandidates = [process.env.OPENAI_MODEL, 'gpt-5-mini', 'gpt-4o-mini', 'gpt-4-mini'].filter(Boolean);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callChatWithFallback(openai, messages) {
  let lastErr = null;
  for (const candidate of modelCandidates) {
    try {
      console.log(`Trying model: ${candidate}`);
      const resp = await openai.chat.completions.create({ model: candidate, messages, response_format: { type: 'json_object' } });
      console.log(`Model ${candidate} succeeded`);
      return { response: resp, model: candidate };
    } catch (err) {
      lastErr = err;
      // If model doesn't exist or 404, try next
      if (err?.message && err.message.includes('does not exist')) {
        console.warn(`Model ${candidate} not available, trying next`);
        continue;
      }
      console.warn(`Model ${candidate} failed:`, err?.message || err);
    }
  }
  throw lastErr || new Error('All models failed');
}

async function generateTranslationForIdea(openai, idea, lang) {
  const prompt = `Translate the provided title, slogan and description into JSON for language: "${lang}".\nReturn JSON in the form: { "title":"..","slogan":"..","description":"..","aiPrompt":".." }\n\nOriginal:\nTitle: ${idea.title}\nSlogan: ${idea.slogan || ''}\nDescription: ${idea.description || ''}`;

  const { response } = await callChatWithFallback(openai, [{ role: 'user', content: prompt }]);
  const content = response.choices?.[0]?.message?.content;
  let parsed = {};
  try {
    parsed = typeof content === 'string' ? JSON.parse(content || '{}') : (content || {});
  } catch (err) {
    console.warn('Failed to parse translation response, falling back to empty:', err?.message || err);
    parsed = {};
  }

  return {
    title: parsed.title || idea.title,
    slogan: parsed.slogan || idea.slogan || '',
    description: parsed.description || idea.description || '',
    aiPrompt: parsed.aiPrompt || idea.aiPrompt || '',
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not set. Set it to enable translation generation.');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const ideas = await prisma.idea.findMany({ include: { translations: true }, where: { isReserved: false } });

  console.log(`Found ${ideas.length} ideas to check`);

  for (const idea of ideas) {
    const existing = (idea.translations || []).map((t) => t.language);
    const missing = SUPPORTED_LANGS.filter((l) => !existing.includes(l));
    if (missing.length === 0) continue;

    console.log(`Idea ${idea.id} missing translations: ${missing.join(', ')}`);

    for (const lang of missing) {
      console.log(`Generating ${lang} for idea ${idea.id} - ${idea.title}`);
      try {
        const translated = await generateTranslationForIdea(openai, idea, lang);

        if (dryRun) {
          console.log('DRY RUN - would create:', { ideaId: idea.id, language: lang, ...translated });
        } else {
          await prisma.ideaTranslation.create({ data: { ideaId: idea.id, language: lang, ...translated } });
          console.log(`Created translation ${lang} for idea ${idea.id}`);
        }
      } catch (err) {
        console.error(`Failed to generate translation for idea ${idea.id} lang ${lang}:`, err?.message || err);
      }

      // Be polite with API rate limits
      await sleep(500);
    }
  }

  await prisma.$disconnect();
  console.log('Done');
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
