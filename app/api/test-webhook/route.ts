import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAdminRequest, unauthorizedAdminResponse } from "@/app/api/admin/_auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const { ideaId, email } = await request.json();

    if (!ideaId || !email) {
      return NextResponse.json(
        { error: "ideaId and email required" },
        { status: 400 }
      );
    }

    // Mark the idea as reserved (simulate webhook)
    const updated = await prisma.idea.update({
      where: { id: parseInt(ideaId) },
      data: {
        isReserved: true,
        reservedAt: new Date(),
        reservedBy: email,
        reservationPrice: 19.0,
      },
    });

    console.log(`[TEST-WEBHOOK] Idea ${ideaId} reserved by ${email}`);

    return NextResponse.json({
      success: true,
      idea: {
        id: updated.id,
        title: updated.title,
        reserved: updated.isReserved,
      },
    });
  } catch (error) {
    console.error("Error in test webhook:", error);
    return NextResponse.json(
      { error: "Failed to reserve idea" },
      { status: 500 }
    );
  }
}
