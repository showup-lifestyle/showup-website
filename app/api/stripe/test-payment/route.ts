import { NextRequest, NextResponse } from "next/server";
import {
  createChallengeOnChain,
  checkEscrowContract,
  type CreateChallengeParams,
} from "@/lib/web3/server/escrowService";

const NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Only allow test payments in development/test environments
const IS_TEST_MODE_ALLOWED =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_TEST_PAYMENTS === "true";

interface TestPaymentRequest {
  amount: number;
  challengeId: string;
  challengeTitle: string;
  challengeDuration: string;
  guarantors: string[];
  metadataUri: string;
  customerEmail?: string;
}

/**
 * POST /api/stripe/test-payment
 * Simulates a successful Stripe payment for testing purposes
 * 
 * This bypasses real Stripe checkout and directly triggers the
 * same logic that would run after a successful payment webhook.
 */
export async function POST(request: NextRequest) {
  try {
    // Security: Only allow test payments in non-production or when explicitly enabled
    if (!IS_TEST_MODE_ALLOWED) {
      return NextResponse.json(
        { error: "Test payments are not allowed in production" },
        { status: 403 }
      );
    }

    const body: TestPaymentRequest = await request.json();
    const {
      amount,
      challengeId,
      challengeTitle,
      challengeDuration,
      guarantors,
      metadataUri,
      customerEmail,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Generate a mock session ID
    const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log("=== TEST PAYMENT INITIATED ===");
    console.log("Mock Session ID:", mockSessionId);
    console.log("Amount:", amount);
    console.log("Challenge ID:", challengeId);
    console.log("Challenge Title:", challengeTitle);
    console.log("Duration:", challengeDuration, "days");
    console.log("Guarantors:", guarantors);
    console.log("Customer Email:", customerEmail || "test@example.com");
    console.log("================================");

    // Check if escrow contract is deployed
    const isContractDeployed = await checkEscrowContract();

    let contractResult = null;

    if (isContractDeployed) {
      // Create challenge on-chain (same as real payment would)
      const params: CreateChallengeParams = {
        challengeId,
        userEmail: customerEmail || "test@example.com",
        amount,
        durationDays: parseInt(challengeDuration || "30", 10),
        guarantorEmails: guarantors,
        metadataUri: metadataUri || "",
        challengeTitle: challengeTitle || "Test Challenge",
        stripeSessionId: mockSessionId,
        stripePaymentIntentId: `test_pi_${Date.now()}`,
      };

      contractResult = await createChallengeOnChain(params);

      if (contractResult.success) {
        console.log("=== TEST CHALLENGE CREATED ON-CHAIN ===");
        console.log("On-chain Challenge ID:", contractResult.challengeId);
        console.log("Transaction Hash:", contractResult.transactionHash);
        console.log("Block Number:", contractResult.blockNumber?.toString());
        console.log("========================================");
      } else {
        console.warn("=== TEST CHALLENGE ON-CHAIN CREATION FAILED ===");
        console.warn("Error:", contractResult.error);
        console.warn("Continuing with mock success...");
        console.warn("================================================");
      }
    } else {
      console.log("=== ESCROW CONTRACT NOT DEPLOYED ===");
      console.log("Simulating successful payment without on-chain creation");
      console.log("Challenge data stored for later processing:");
      console.log({
        challengeId,
        mockSessionId,
        amount,
        customerEmail: customerEmail || "test@example.com",
      });
      console.log("=====================================");
    }

    // Return success with redirect URL (same as real Stripe would)
    const successUrl = `${NEXT_PUBLIC_APP_URL}/deposit/success?session_id=${mockSessionId}&test=true`;

    return NextResponse.json({
      success: true,
      sessionId: mockSessionId,
      url: successUrl,
      testMode: true,
      contractCreated: contractResult?.success || false,
      contractResult: contractResult || null,
      message: "Test payment simulated successfully",
    });
  } catch (error) {
    console.error("Test payment error:", error);
    return NextResponse.json(
      { error: "Test payment simulation failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/test-payment
 * Returns test mode status
 */
export async function GET() {
  return NextResponse.json({
    testModeAllowed: IS_TEST_MODE_ALLOWED,
    environment: process.env.NODE_ENV,
    message: IS_TEST_MODE_ALLOWED
      ? "Test payments are enabled"
      : "Test payments are disabled in production",
  });
}
