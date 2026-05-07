import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestAds() {
  console.log("🎬 Creating test ad slots with advertisers...\n");
  
  // Clean existing data
  await prisma.advertiser.deleteMany({});
  await prisma.adSlot.deleteMany({});
  console.log("🧹 Cleaned existing data\n");

  const adsCount = process.argv[2] !== undefined ? parseInt(process.argv[2]) : 3;
  console.log(`📊 Creating ${adsCount} test ads\n`);

  if (adsCount === 0) {
    console.log("✅ Database cleaned, no ads created\n");
    console.log("\n📊 Database stats:");
    const totalSlots = await prisma.adSlot.count();
    const totalAdvertisers = await prisma.advertiser.count();
    console.log(`   - AdSlots: ${totalSlots}`);
    console.log(`   - Advertisers: ${totalAdvertisers}\n`);
    await prisma.$disconnect();
    return;
  }

  const adNames = [
    "DevFlow", "CodeSync", "CloudPeak", "DataVault", "WebMagic",
    "ApiNinja", "DesignHub", "HostPro", "SecureVault", "FastDeploy"
  ];

  const logos = [
    "https://pfff.me/svg/grumpySheep.svg",
    "https://api.dicebear.com/7.x/shapes/svg?seed=1",
    "https://api.dicebear.com/7.x/shapes/svg?seed=2",
    "https://api.dicebear.com/7.x/shapes/svg?seed=3",
  ];

  for (let i = 0; i < adsCount; i++) {
    const adName = adNames[i] || `SaaS${i + 1}`;
    const logoUrl = logos[i % logos.length];
    
    await prisma.adSlot.create({
      data: {
        position: i + 1,
        side: "recto",
        price: 50 + (i * 10),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        advertisers: {
          create: {
            saasName: adName,
            logoUrl: logoUrl,
            targetUrl: `https://${adName.toLowerCase()}.example.com`,
            customerEmail: `contact@${adName.toLowerCase()}.example.com`,
            stripeSessionId: `cs_test_${i}`,
          },
        },
      },
    });
    console.log(`✅ Ad ${i + 1}/${adsCount} - ${adName} created`);
  }

  console.log(`\n🎉 Successfully created ${adsCount} test ads!`);
  console.log("\n📊 Database stats:");
  const totalSlots = await prisma.adSlot.count();
  const totalAdvertisers = await prisma.advertiser.count();
  console.log(`   - AdSlots: ${totalSlots}`);
  console.log(`   - Advertisers: ${totalAdvertisers}\n`);

  await prisma.$disconnect();
}

createTestAds().catch(console.error);
