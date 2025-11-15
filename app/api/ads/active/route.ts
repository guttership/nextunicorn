import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const position = searchParams.get("position") || "left";

  try {
    // Get all active advertisers ordered by creation
    const advertisers = await prisma.advertiser.findMany({
      where: {
        adSlot: {
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const n = advertisers.length;
    const totalFaces = n + 1; // Always n+1 faces total (exactly one more than advertisers)

    // Fill faces sequentially: L-recto, L-verso, R-recto, R-verso, repeat
    // Each line has exactly 2 cards (left/right), each card has 2 faces (recto/verso)
    const lines = [];
    let currentLine = { left: { recto: null, verso: null }, right: { recto: null, verso: null } };
    let lineHasLeftContent = false;
    let lineHasRightContent = false;

    for (let i = 0; i < totalFaces; i++) {
      const facePosition = i % 4; // 0=L recto, 1=L verso, 2=R recto, 3=R verso
      const advertiser = i < n ? advertisers[i] : null; // null for the (n+1)th face

      if (facePosition === 0) {
        // Starting new left card (recto)
        if (i > 0) {
          // Push previous line before starting a new one
          lines.push({ 
            ...currentLine, 
            _hasLeft: lineHasLeftContent, 
            _hasRight: lineHasRightContent 
          });
          currentLine = { left: { recto: null, verso: null }, right: { recto: null, verso: null } };
          lineHasLeftContent = false;
          lineHasRightContent = false;
        }
        currentLine.left.recto = advertiser;
        lineHasLeftContent = true; // Mark that left has been touched
      } else if (facePosition === 1) {
        // Left card verso
        currentLine.left.verso = advertiser;
        lineHasLeftContent = true;
      } else if (facePosition === 2) {
        // Right card recto
        currentLine.right.recto = advertiser;
        lineHasRightContent = true;
      } else if (facePosition === 3) {
        // Right card verso
        currentLine.right.verso = advertiser;
        lineHasRightContent = true;
      }
    }

    // Push the last line
    lines.push({ 
      ...currentLine, 
      _hasLeft: lineHasLeftContent, 
      _hasRight: lineHasRightContent 
    });

    // Return cards for the requested position
    // Filter based on whether the position was explicitly assigned
    const cardsToShow = position === "left" 
      ? lines.filter((l) => (l as {_hasLeft?: boolean})._hasLeft).map((l) => l.left)
      : lines.filter((l) => (l as {_hasRight?: boolean})._hasRight).map((l) => l.right);

    return NextResponse.json({ cards: cardsToShow });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ cards: [] });
  }
}
