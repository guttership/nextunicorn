import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Parse pricing tiers from environment variables for easy adjustment
function getPricingTiers() {
  const tiers = [
    process.env.PRICING_TIER_1,
    process.env.PRICING_TIER_2,
    process.env.PRICING_TIER_3,
    process.env.PRICING_TIER_4,
    process.env.PRICING_TIER_5,
  ].filter(Boolean);

  return tiers.map(tier => {
    const [maxSpots, monthlyPrice, yearlyPrice] = tier!.split(',').map(Number);
    return { maxSpots, monthlyPrice, yearlyPrice };
  }).concat([
    // Default fallback if env vars not set
    { maxSpots: 1, monthlyPrice: 49, yearlyPrice: 490 },
    { maxSpots: 2, monthlyPrice: 99, yearlyPrice: 990 },
    { maxSpots: 4, monthlyPrice: 199, yearlyPrice: 1990 },
    { maxSpots: 8, monthlyPrice: 399, yearlyPrice: 3990 },
    { maxSpots: Infinity, monthlyPrice: 799, yearlyPrice: 7990 },
  ]).slice(0, 5); // Use env vars if available, otherwise defaults
}

export async function GET() {
  try {
    const PRICING_TIERS = getPricingTiers();
    // Count active advertisers (each advertiser = 1 spot)
    const activeSpots = await prisma.advertiser.count({
      where: {
        adSlot: {
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
      },
    });

    // Find current tier
    const currentTier = PRICING_TIERS.find(tier => activeSpots < tier.maxSpots) || PRICING_TIERS[PRICING_TIERS.length - 1];

    // Calculate next tier
    const nextTier = PRICING_TIERS.find(tier => tier.maxSpots > currentTier.maxSpots);

    return NextResponse.json({
      currentSpot: activeSpots + 1,
      totalActiveSpots: activeSpots,
      pricing: {
        monthly: currentTier.monthlyPrice,
        yearly: currentTier.yearlyPrice,
        yearlySavings: (currentTier.monthlyPrice * 12) - currentTier.yearlyPrice,
      },
      nextTier: nextTier ? {
        atSpot: currentTier.maxSpots + 1,
        monthly: nextTier.monthlyPrice,
        yearly: nextTier.yearlyPrice,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}
