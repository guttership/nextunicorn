const { PrismaClient } = require("@prisma/client");
const Stripe = require("stripe");

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createAdSpotFromSession() {
  const sessionId = "cs_test_a1k6bh6AZ9sY0Zzl9YTUH0tjI2XSfuRKmZJMm8c7RoQ1DNJHUeYgJVDxvX";

  try {
    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log("=== SESSION FOUND ===");
    console.log("Customer email:", session.customer_email);
    console.log("Metadata:", session.metadata);

    if (!session.metadata) {
      console.error("❌ No metadata found!");
      return;
    }

    // Create ad spot
    const adSpot = await prisma.adSpot.create({
      data: {
        saasName: session.metadata.saasName,
        logoUrl: session.metadata.logoUrl,
        targetUrl: session.metadata.targetUrl,
        plan: session.metadata.plan,
        customerEmail: session.customer_email || "unknown@example.com",
        stripeSessionId: session.id,
        expiresAt: new Date(Date.now() + parseInt(session.metadata.duration) * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });

    console.log("✅ AdSpot created:", adSpot);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdSpotFromSession();
