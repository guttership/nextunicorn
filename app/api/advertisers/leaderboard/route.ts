import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const advertisers = await prisma.advertiser.findMany({
      include: {
        adSlot: true,
      },
      orderBy: {
        clicks: "desc",
      },
      take: 10,
    });

    type AdvertiserWithSlot = {
      id: number;
      saasName: string;
      logoUrl: string;
      clicks: number;
      adSlot: { price: number };
    };

    const leaderboard = advertisers.map((ad: AdvertiserWithSlot, index: number) => ({
      rank: index + 1,
      id: ad.id,
      saasName: ad.saasName,
      logoUrl: ad.logoUrl,
      clicks: ad.clicks,
      price: ad.adSlot.price,
      revenue: ad.clicks * 0.1, // Example: 10 cents per click
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching advertisers leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
