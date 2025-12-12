const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function create() {
  try {
    const idea = await prisma.idea.create({
      data: {
        title: 'Test Community Idea',
        slogan: 'Solve X for indie devs',
        description: 'A small app that automates X specifically for indie developers',
        aiPrompt: '',
        aiPromptId: `user-${Date.now()}`,
        isDaily: false,
        score: 0,
        origin: 'COMMUNITY',
        audience: 'indie-dev',
      },
    });

    console.log('Created community idea with ID', idea.id);
    await prisma.$disconnect();
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

create();
