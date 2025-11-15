import { prisma } from "@/app/lib/db/prisma";

async function main() {
  console.log("Checking database connection...");

  try {
    // Test connection
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful");

    // Count ideas
    const ideaCount = await prisma.idea.count();
    console.log(`Current ideas in database: ${ideaCount}`);

    // Count votes
    const voteCount = await prisma.vote.count();
    console.log(`Current votes in database: ${voteCount}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
