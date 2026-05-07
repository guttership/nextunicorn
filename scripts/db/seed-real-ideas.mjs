import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ideas = [
  {
    title: "TaskFlow",
    slogan: "Real-time task collaboration with AI insights",
    description: "A project management tool that uses AI to predict project risks, optimize team workflows, and automatically delegate tasks based on team capacity and skills.",
    aiPrompt: "Imagine a tool that predicts project failures before they happen"
  },
  {
    title: "CodeReview.ai",
    slogan: "Automated code review that learns your team's standards",
    description: "An IDE plugin that reviews code in real-time, learns your team's coding standards, and suggests improvements before code is committed.",
    aiPrompt: "What if code reviews happened instantly as you write?"
  },
  {
    title: "CustomerMind",
    slogan: "Predict customer churn before it happens",
    description: "An analytics platform that tracks customer behavior patterns and alerts teams when someone is likely to churn, with personalized retention strategies.",
    aiPrompt: "Imagine knowing exactly which customers will leave next month"
  },
  {
    title: "SleepOptimizer",
    slogan: "Personalized sleep coaching with real-time tracking",
    description: "A health app that combines wearable data with AI coaching to improve sleep quality, tracking environmental factors and providing nighttime recommendations.",
    aiPrompt: "What if your mattress told you how to sleep better?"
  },
  {
    title: "LocalMarket",
    slogan: "Connect local producers directly with consumers",
    description: "A marketplace platform that connects farmers and local producers directly to consumers, cutting out middlemen and ensuring freshness with real-time inventory.",
    aiPrompt: "Imagine buying vegetables directly from the farm that grew them"
  },
  {
    title: "MeetingBooster",
    slogan: "Turn boring meetings into productive ones",
    description: "A meeting assistant that records discussions, extracts action items automatically, tracks completion, and sends smart reminders about follow-ups.",
    aiPrompt: "What if every meeting automatically created a to-do list?"
  },
  {
    title: "SkillSwap",
    slogan: "Peer-to-peer learning marketplace for professionals",
    description: "A platform where professionals offer and exchange skills they've mastered with others. Pay with time, not money - trade your expertise for theirs.",
    aiPrompt: "Imagine learning programming from a designer who wants to learn your skills"
  },
  {
    title: "HealthyHabit",
    slogan: "Habit tracking with social accountability",
    description: "A habit-building app that gamifies personal goals, connects you with friends for accountability, and uses psychology to maximize habit retention.",
    aiPrompt: "What if your friends could see your progress toward fitness goals?"
  },
  {
    title: "ContractFast",
    slogan: "Generate legal contracts in seconds",
    description: "An AI-powered contract generator that creates customized legal documents for freelancers and small businesses, ensuring compliance with local laws.",
    aiPrompt: "Imagine never hiring a lawyer for standard contracts again"
  },
  {
    title: "GreenRoute",
    slogan: "Optimize logistics for carbon-neutral delivery",
    description: "A delivery optimization platform that minimizes carbon emissions by calculating the most eco-friendly routes and consolidating shipments intelligently.",
    aiPrompt: "What if every delivery route was designed to save the planet?"
  }
];

async function seed() {
  console.log('🌱 Seeding database with real SaaS ideas...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    await prisma.idea.create({
      data: {
        title: idea.title,
        slogan: idea.slogan,
        description: idea.description,
        aiPrompt: idea.aiPrompt,
        aiPromptId: `idea-${i + 1}`,
        generatedAt: today,
        isChampion: false,
        origin: 'AI',
        score: 0,
      },
    });
    console.log(`✓ Created: ${idea.title}`);
  }

  console.log('\n✅ All ideas seeded!');
  process.exit(0);
}

seed().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
