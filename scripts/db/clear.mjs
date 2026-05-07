import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clear() {
  console.log('Clearing database...');
  
  await prisma.vote.deleteMany();
  console.log('✓ Votes deleted');
  
  await prisma.idea.deleteMany();
  console.log('✓ Ideas deleted');
  
  console.log('Database cleared!');
  process.exit(0);
}

clear().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
