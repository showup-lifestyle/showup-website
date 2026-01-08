"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CreditCard, TestTube, Apple } from "lucide-react";

interface CreateCheckoutSessionParams {
  amount: number; // Amount in USD
  challengeId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface TestPaymentParams {
  amount: number;
  challengeId: string;
  challengeTitle: string;
  challengeDuration: string;
  guarantors: string[];
  metadataUri: string;
  customerEmail?: string;
}

interface TestPaymentResponse {
  success: boolean;
  sessionId: string;
  url: string;
  testMode: boolean;
  contractCreated: boolean;
  message: string;
}

/**
 * Create a Stripe Checkout session
 */
async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CheckoutSessionResponse> {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout session");
  }

  return response.json();
}

/**
 * Create a test payment (bypasses Stripe)
 */
async function createTestPayment(
  params: TestPaymentParams,
): Promise<TestPaymentResponse> {
  const response = await fetch("/api/stripe/test-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create test payment");
  }

  return response.json();
}

/**
 * Check if test mode is available
 */
async function checkTestModeStatus(): Promise<boolean> {
  try {
    const response = await fetch("/api/stripe/test-payment");
    if (response.ok) {
      const data = await response.json();
      return data.testModeAllowed;
    }
    return false;
  } catch {
    return false;
  }
}

export interface StripeCheckoutProps {
  amount: number; // Amount in USD
  challengeId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Stripe Checkout component with Apple Pay/Card support and Test Mode
 *
 * In development/test environments, shows both real payment and test payment options.
 * In production, only shows real Stripe checkout.
 */
export function StripeCheckout({
  amount,
  challengeId,
  customerEmail,
  metadata,
  onSuccess,
  onError,
  className,
  children,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testModeAvailable, setTestModeAvailable] = useState(false);

  // Check if test mode is available on mount
  useEffect(() => {
    checkTestModeStatus().then(setTestModeAvailable);
  }, []);

  const handleCheckout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { url } = await createCheckoutSession({
        amount,
        challengeId,
        customerEmail,
        metadata,
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
      setIsLoading(false);
      onError?.(error);
    }
  }, [amount, challengeId, customerEmail, metadata, onError]);

  const handleTestPayment = useCallback(async () => {
    try {
      setIsTestLoading(true);
      setError(null);

      // Parse metadata for test payment
      const guarantors = metadata?.guarantors
        ? JSON.parse(metadata.guarantors)
        : [];

      const result = await createTestPayment({
        amount,
        challengeId: challengeId || `test_${Date.now()}`,
        challengeTitle: metadata?.challengeTitle || "Test Challenge",
        challengeDuration: metadata?.challengeDuration || "30",
        guarantors,
        metadataUri: metadata?.metadataUri || "",
        customerEmail,
      });

      if (result.success) {
        onSuccess?.(result.sessionId);
        // Redirect to success page
        window.location.href = result.url;
      } else {
        throw new Error("Test payment failed");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
      setIsTestLoading(false);
      onError?.(error);
    }
  }, [amount, challengeId, customerEmail, metadata, onSuccess, onError]);

  if (children) {
    return (
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? "Processing..." : children}
      </button>
    );
  }

  return (
    <div className={className}>
      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleCheckout}
            className="mt-2 text-sm text-red-700 underline hover:no-underline dark:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Test Mode Banner */}
      {testModeAvailable && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Test Mode Available
            </span>
          </div>
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
            Use test payment to simulate the flow without real charges.
          </p>
        </div>
      )}

      {/* Payment Buttons */}
      <div className="space-y-3">
        {/* Real Payment Button - Apple Pay / Card */}
        <button
          onClick={handleCheckout}
          disabled={isLoading || isTestLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Processing...
            </span>
          ) : (
            <>
              <Apple className="h-5 w-5" />
              <span>Pay ${amount} with Apple Pay / Card</span>
            </>
          )}
        </button>

        {/* Alternative Card Payment */}
        <button
          onClick={handleCheckout}
          disabled={isLoading || isTestLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 font-medium text-foreground transition-all duration-300 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              Processing...
            </span>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Pay with Credit/Debit Card</span>
            </>
          )}
        </button>

        {/* Test Payment Button (only shown in test mode) */}
        {testModeAvailable && (
          <button
            onClick={handleTestPayment}
            disabled={isLoading || isTestLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 py-3 font-medium text-yellow-700 transition-all duration-300 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
          >
            {isTestLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
                Simulating Payment...
              </span>
            ) : (
              <>
                <TestTube className="h-5 w-5" />
                <span>Test Payment (No Charge)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Payment Info */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Secure payment powered by Stripe. Your payment information is encrypted.
      </p>
    </div>
  );
}

export default StripeCheckout;
