import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: Request) {
  try {
    const { plan, logoUrl, saasName, targetUrl, email } = await request.json();

    // Get current dynamic pricing
    const pricingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ads/pricing`);
    const pricing = await pricingResponse.json();

    const amount = plan === "yearly" ? pricing.pricing.yearly : pricing.pricing.monthly;
    const duration = plan === "yearly" ? 365 : 30;

    // Create Stripe Checkout Session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `NextUnicorn Ad Spot #${pricing.currentSpot}`,
              description: `${plan === "yearly" ? "Yearly" : "Monthly"} rotating ad spot`,
            },
            unit_amount: amount * 100, // Convert to cents
            recurring: {
              interval: plan === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/advertise?canceled=true`,
      customer_email: email,
      metadata: {
        logoUrl,
        saasName,
        targetUrl,
        plan,
        duration: duration.toString(),
        spotNumber: pricing.currentSpot.toString(),
        pricePaid: amount.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
