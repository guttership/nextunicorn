import { GoogleGenerativeAI } from "@google/generative-ai";

interface SaaSIdea {
  title: string;
  slogan: string;
  description: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateDailySaaSIdeas(count: number = 10) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate ${count} unique and innovative SaaS ideas. Each idea should be:
1. Original - NOT a cliche or copycat of existing products (no "social network for pets", no Uber/Airbnb clones)
2. Viable - Specific enough to inspire actual action, solving real problems
3. Well-formulated - Clear name, compelling slogan, detailed description

For each idea, provide a JSON object with this exact structure:
{
  "title": "Short product name (max 50 chars)",
  "slogan": "One-line value proposition (max 100 chars)",
  "description": "2-3 sentence description of the problem solved and how (max 200 chars)"
}

Return ONLY a valid JSON array, no other text. Example format:
[
  {"title": "IdeaName", "slogan": "The slogan", "description": "Description..."},
  ...
]

Focus on:
- B2B tools for specific niches (accounting, HR, marketing)
- Developer productivity tools
- Data/analytics for underserved markets
- Automation for manual processes
- Health tech, educational tech, environmental tech
- Tools for remote work, team collaboration
- API/infrastructure services
- Vertical SaaS for specific industries

Generate creative, feasible, and inspiring ideas:`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response");
  }

  const ideas: SaaSIdea[] = JSON.parse(jsonMatch[0]);
  return ideas.map((idea) => ({
    ...idea,
    aiPromptId: new Date().toISOString(),
  }));
}
