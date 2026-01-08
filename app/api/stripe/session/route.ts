import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

/**
 * GET /api/stripe/session?session_id=xxx
 * Retrieves session details for the success page
 */
export async function GET(request: NextRequest) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Parse guarantors count from metadata
    let guarantorCount = 0;
    try {
      const guarantors = JSON.parse(session.metadata?.guarantors || "[]");
      guarantorCount = Array.isArray(guarantors) ? guarantors.length : 0;
    } catch {
      // Ignore parsing errors
    }

    return NextResponse.json({
      amount: (session.amount_total || 0) / 100,
      challengeTitle: session.metadata?.challengeTitle || "",
      challengeDuration: session.metadata?.challengeDuration || "",
      guarantorCount,
      customerEmail: session.customer_details?.email || "",
      paymentStatus: session.payment_status,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
