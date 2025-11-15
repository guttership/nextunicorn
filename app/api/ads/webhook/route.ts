import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata!;

    try {
      // Get next available position
      const maxPositionSlot = await prisma.adSlot.findFirst({
        orderBy: { position: "desc" },
      });
      let nextPosition = (maxPositionSlot?.position || 0) + 1;
      let side: "recto" | "verso" = "recto";

      // Check if there's already a recto for this position
      const existingRecto = await prisma.adSlot.findFirst({
        where: {
          position: nextPosition - 1,
          side: "recto",
        },
      });

      if (existingRecto) {
        // If previous position has recto, use verso on same position
        nextPosition = nextPosition - 1;
        side = "verso";
      }

      // Find or create AdSlot
      let adSlot = await prisma.adSlot.findFirst({
        where: {
          position: nextPosition,
          side,
        },
      });

      if (!adSlot) {
        adSlot = await prisma.adSlot.create({
          data: {
            position: nextPosition,
            side,
            price: parseFloat(metadata.pricePaid),
            expiresAt: new Date(
              Date.now() + parseInt(metadata.duration) * 24 * 60 * 60 * 1000
            ),
            isActive: true,
          },
        });
      }

      // Create Advertiser
      await prisma.advertiser.create({
        data: {
          saasName: metadata.saasName,
          logoUrl: metadata.logoUrl,
          targetUrl: metadata.targetUrl,
          customerEmail: session.customer_email!,
          stripeSessionId: session.id,
          adSlotId: adSlot.id,
        },
      });

      console.log(`✅ Created advertiser: ${metadata.saasName} at position ${nextPosition}/${side}`);
    } catch (error) {
      console.error("Error creating ad:", error);
      return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
    }
  }

  // Handle subscription cancellation
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.advertiser.updateMany({
      where: {
        stripeSessionId: subscription.id,
      },
      data: {
        // Mark as inactive by deleting? Or soft delete?
        // For now, just find and potentially delete
      },
    });
  }

  return NextResponse.json({ received: true });
}
