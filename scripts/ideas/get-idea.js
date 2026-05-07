const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = process.argv[2] ? parseInt(process.argv[2], 10) : 264;
  const idea = await prisma.idea.findUnique({ where: { id }, include: { translations: true } });
  console.log(JSON.stringify(idea, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
