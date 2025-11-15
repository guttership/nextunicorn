import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingAds = await prisma.advertiser.findMany({
      where: {
        isApproved: false,
      },
      include: {
        adSlot: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ads: pendingAds });
  } catch (error) {
    console.error("Error fetching pending ads:", error);
    return NextResponse.json({ error: "Failed to fetch pending ads" }, { status: 500 });
  }
}
