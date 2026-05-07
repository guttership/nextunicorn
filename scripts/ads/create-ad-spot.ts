import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

async function createAdSpotFromSession() {
  const sessionId = "cs_test_a1EAhiCsB6Nm3zqK4o3TA7YNbEuqnioa1XhYSe24jjj1geCEPv897n9mae";

  try {
    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    
    console.log("=== SESSION COMPLÈTE ===");
    console.log(JSON.stringify(session, null, 2));
    console.log("=== FIN SESSION ===");

    if (!session.metadata) {
      console.error("❌ Pas de métadonnées trouvées !");
      return;
    }

    // Create ad slot
    const adSlot = await prisma.adSlot.create({
      data: {
        position: 1,
        side: "recto",
        price: parseFloat(session.amount_total?.toString() || "0") / 100,
        expiresAt: new Date(Date.now() + parseInt(session.metadata.duration) * 24 * 60 * 60 * 1000),
        isActive: true,
        advertisers: {
          create: {
            saasName: session.metadata.saasName,
            logoUrl: session.metadata.logoUrl,
            targetUrl: session.metadata.targetUrl,
            customerEmail: session.customer_email || "unknown@example.com",
            stripeSessionId: session.id,
          }
        },
      },
    });

    console.log("✅ AdSlot créé:", adSlot);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdSpotFromSession();
