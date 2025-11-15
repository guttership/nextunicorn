import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ideas = [
  {
    title: "Tandem",
    slogan: "Find your perfect meeting partner, no more awkward silences",
    description: "Tandem helps you find and connect with other meeting attendees for added productivity and discussion insights",
    aiPrompt: "Imagine attending a meeting with someone new, feeling awkward, and struggling to contribute"
  },
  {
    title: "Eterna",
    slogan: "Never lose track of your bookshelves again",
    description: "Eterna is a personal library management platform that helps you catalog, organize, and keep track of your book collection",
    aiPrompt: "Imagine being unable to find a specific book on your shelf, only to remember you bought it years ago"
  },
  {
    title: "Promoter",
    slogan: "Transform customer feedback into action",
    description: "Promoter is a user-friendly feedback analysis tool that helps businesses act on customer insights",
    aiPrompt: "Imagine receiving feedback from customers, but not knowing what to do with it"
  },
  {
    title: "ToneScanner",
    slogan: "Unlock the power of tone in your conversations",
    description: "ToneScanner is a sentiment analysis tool that helps you detect and manage tone in emails, chats, and meetings",
    aiPrompt: "Imagine accidentally sending an email with the wrong tone, only to realize it's too late"
  },
  {
    title: "Recast",
    slogan: "Reimagine your business with AI-driven storytelling",
    description: "Recast is a platform that uses AI to help businesses create compelling narratives and presentations",
    aiPrompt: "Imagine being unable to convey your business vision in a clear and engaging way"
  },
  {
    title: "SpeakUp",
    slogan: "Amplify your team's voice in the noise",
    description: "SpeakUp is a team collaboration platform that helps remote teams communicate and align more effectively",
    aiPrompt: "Imagine working with a remote team, struggling to keep everyone on the same page"
  },
  {
    title: "Muse",
    slogan: "Uncover your creative potential",
    description: "Muse is a creative brainstorming platform that helps individuals and teams generate new ideas",
    aiPrompt: "Imagine sitting in a brainstorming session, but struggling to generate new ideas"
  },
  {
    title: "Audius",
    slogan: "Elevate your podcast production with AI-powered editing",
    description: "Audius is a podcast editing platform that uses AI to help creators produce high-quality episodes",
    aiPrompt: "Imagine recording a great podcast episode, but struggling with editing and sound quality"
  },
  {
    title: "Persona",
    slogan: "Create seamless customer journeys with AI-driven personas",
    description: "Persona is a platform that helps businesses create AI-driven customer personas and journey maps",
    aiPrompt: "Imagine creating a customer persona, but struggling to get the insights you need"
  }
];

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const idea of ideas) {
    await prisma.idea.create({
      data: {
        ...idea,
        aiPromptId: idea.title.toLowerCase().replace(/\s+/g, '-'),
        generatedAt: today,
        isChampion: false,
        score: 0,
      },
    });
  }

  console.log(`✅ Inserted ${ideas.length} OpenRouter-generated ideas!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
