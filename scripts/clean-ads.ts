import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanAds() {
  console.log("🗑️  Suppression des ads existantes...\n");

  // Supprimer tous les advertisers
  const deletedAdvertisers = await prisma.advertiser.deleteMany({});
  console.log(`✅ ${deletedAdvertisers.count} advertiser(s) supprimé(s)`);

  // Supprimer tous les ad slots
  const deletedSlots = await prisma.adSlot.deleteMany({});
  console.log(`✅ ${deletedSlots.count} ad slot(s) supprimé(s)`);

  await prisma.$disconnect();
}

cleanAds().catch(console.error);
