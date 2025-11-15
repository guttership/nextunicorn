import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearIdeas() {
  console.log("🗑️ Suppression de toutes les idées...\n");
  
  await prisma.vote.deleteMany({});
  console.log("✅ Votes supprimés");
  
  await prisma.ideaTranslation.deleteMany({});
  console.log("✅ Traductions supprimées");
  
  await prisma.idea.deleteMany({});
  console.log("✅ Idées supprimées");
  
  const count = await prisma.idea.count();
  console.log(`\n📊 Base de données: ${count} idées restantes\n`);
  
  await prisma.$disconnect();
}

clearIdeas().catch(console.error);
