import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: Request) {
  try {
    const { plan, logoUrl, saasName, targetUrl, email } = await request.json();

    // Get current dynamic pricing
    const pricingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ads/pricing`);
    const pricing = await pricingResponse.json();

    // Determine pricing and mode based on plan
    let amount: number;
    let duration: number;
    let isSubscription = false;
    let interval: "month" | "year" | undefined;

    if (plan === "one-shot") {
      amount = pricing.pricing.monthly; // Price for 30 days one-time
      duration = 30;
      isSubscription = false;
    } else if (plan === "yearly") {
      amount = pricing.pricing.yearly;
      duration = 365;
      isSubscription = true;
      interval = "year";
    } else {
      // monthly subscription
      amount = pricing.pricing.monthly;
      duration = 30;
      isSubscription = true;
      interval = "month";
    }

    // Build line items
    const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
      currency: "usd",
      product_data: {
        name: `NextUnicorn Ad Spot #${pricing.currentSpot}`,
        description: plan === "one-shot"
          ? "One-time 30-day ad spot"
          : `${plan === "yearly" ? "Yearly" : "Monthly"} subscription - cancel anytime`,
      },
      unit_amount: amount * 100, // Convert to cents
    };

    if (isSubscription && interval) {
      priceData.recurring = { interval };
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: priceData,
        quantity: 1,
      },
    ];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: isSubscription ? "subscription" : "payment",
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
