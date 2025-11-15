import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, approved } = await request.json();

    if (approved) {
      // Approuver la pub
      await prisma.advertiser.update({
        where: { id },
        data: { isApproved: true },
      });

      return NextResponse.json({ success: true, message: "Ad approved" });
    } else {
      // Rejeter = supprimer
      await prisma.advertiser.delete({
        where: { id },
      });

      return NextResponse.json({ success: true, message: "Ad rejected and deleted" });
    }
  } catch (error) {
    console.error("Error processing ad approval:", error);
    return NextResponse.json({ error: "Failed to process approval" }, { status: 500 });
  }
}
