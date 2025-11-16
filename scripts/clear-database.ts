import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Clearing database...');
    
    // Delete all votes first (foreign key constraint)
    const votesDeleted = await prisma.vote.deleteMany({});
    console.log(`Deleted ${votesDeleted.count} votes`);
    
    // Delete all idea translations
    const translationsDeleted = await prisma.ideaTranslation.deleteMany({});
    console.log(`Deleted ${translationsDeleted.count} translations`);
    
    // Delete all ideas
    const ideasDeleted = await prisma.idea.deleteMany({});
    console.log(`Deleted ${ideasDeleted.count} ideas`);
    
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
