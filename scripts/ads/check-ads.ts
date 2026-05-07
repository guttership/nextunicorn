import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDb() {
  try {
    const adSlots = await prisma.adSlot.findMany();
    console.log("AdSlots found:", adSlots.length);
    console.log(JSON.stringify(adSlots, null, 2));

    const advertisers = await prisma.advertiser.findMany();
    console.log("\nAdvertisers found:", advertisers.length);
    console.log(JSON.stringify(advertisers, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
