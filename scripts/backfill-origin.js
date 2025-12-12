const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backfill() {
  try {
    console.log('Backfilling idea origin and default flags...');

    const updateAI = await prisma.idea.updateMany({
      where: {
        OR: [
          { isDaily: true },
          { aiPromptId: { contains: 'generated_' } },
        ],
      },
      data: {
        origin: 'AI',
      },
    });

    console.log(`Updated ${updateAI.count} ideas to origin = AI`);

    const updateCommunity = await prisma.idea.updateMany({
      where: {
        aiPromptId: { startsWith: 'user-' },
      },
      data: {
        origin: 'COMMUNITY',
      },
    });

    console.log(`Updated ${updateCommunity.count} ideas to origin = COMMUNITY`);

    await prisma.$disconnect();
  } catch (err) {
    console.error('Backfill failed', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

backfill();
