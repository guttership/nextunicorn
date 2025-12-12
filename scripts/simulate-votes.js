const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function simulate(ideaId, votes = 50) {
  try {
    console.log(`Simulating ${votes} votes for idea ID ${ideaId}`);

    // We'll vote the idea as winner against a random existing idea each time
    const otherIdeas = await prisma.idea.findMany({ where: { id: { not: ideaId } }, select: { id: true }, take: 5 });
    if (!otherIdeas.length) {
      console.log('No other ideas found; cannot simulate');
      return;
    }

    for (let i = 0; i < votes; i++) {
      const opponent = otherIdeas[i % otherIdeas.length].id;
      const voterId = uuidv4();
      const today = new Date().toISOString().split('T')[0];
      const duelId = `${today}-${Math.min(ideaId, opponent)}-${Math.max(ideaId, opponent)}`;

      try {
        await prisma.vote.create({ data: { voterId, winnerIdeaId: ideaId, loserIdeaId: opponent, duelId } });
        await prisma.idea.update({ where: { id: ideaId }, data: { score: { increment: 1 } } });
      } catch (err) {
        // ignore duplicates
      }
    }

    console.log('Simulation complete');

    const updated = await prisma.idea.findUnique({ where: { id: ideaId } });
    console.log('Updated idea:', updated);

    await prisma.$disconnect();
  } catch (err) {
    console.error('Simulate votes error', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/simulate-votes.js <ideaId> [count]');
  process.exit(1);
}

const ideaId = parseInt(args[0], 10);
const count = args[1] ? parseInt(args[1], 10) : 50;

simulate(ideaId, count);
