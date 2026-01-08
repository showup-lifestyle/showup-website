"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Check, Loader2, AlertCircle, TestTube } from "lucide-react";

interface SessionDetails {
  amount: number;
  challengeTitle: string;
  challengeDuration: string;
  guarantorCount: number;
  customerEmail: string;
}

function DepositSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isTestPayment = searchParams.get("test") === "true";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // For test payments, we don't need to fetch from Stripe
    if (isTestPayment) {
      setStatus("success");
      return;
    }

    // Fetch session details from API
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setSessionDetails(data);
          setStatus("success");
        } else {
          // Even if we can't fetch details, show success (payment was confirmed by redirect)
          setStatus("success");
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
        // Still show success since Stripe redirected here
        setStatus("success");
      }
    };

    fetchSessionDetails();
  }, [sessionId, isTestPayment]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error" && !sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t find your payment session. Please contact support if you were charged.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02]"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Test Mode Banner */}
        {isTestPayment && (
          <div className="mb-4 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/20">
            <div className="flex items-center justify-center gap-2">
              <TestTube className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">
                Test Payment - No Real Charges
              </span>
            </div>
            <p className="mt-2 text-center text-sm text-yellow-600 dark:text-yellow-400">
              This is a simulated payment for testing purposes.
            </p>
          </div>
        )}

        <div className="rounded-2xl neumorphic p-8 text-center">
          {/* Success Icon */}
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            isTestPayment 
              ? "bg-yellow-100 dark:bg-yellow-900/30" 
              : "bg-green-100 dark:bg-green-900/30"
          }`}>
            {isTestPayment ? (
              <TestTube className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {isTestPayment ? "Test Payment Successful!" : "Payment Successful!"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isTestPayment 
              ? "Your test challenge has been created. No real money was charged."
              : "Your challenge has been created and your deposit is secured."
            }
          </p>

          {/* Challenge Details */}
          {sessionDetails && (
            <div className="mt-6 rounded-xl bg-muted p-4 text-left text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${sessionDetails.amount}</span>
              </div>
              {sessionDetails.challengeTitle && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Challenge</span>
                  <span className="font-medium">{sessionDetails.challengeTitle}</span>
                </div>
              )}
              {sessionDetails.challengeDuration && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{sessionDetails.challengeDuration} days</span>
                </div>
              )}
              {sessionDetails.guarantorCount > 0 && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Guarantors</span>
                  <span className="font-medium">{sessionDetails.guarantorCount}</span>
                </div>
              )}
            </div>
          )}

          {/* Test Mode Info */}
          {isTestPayment && (
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-left text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <strong>Test Mode Details:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>No real payment was processed</li>
                <li>Smart contract creation was simulated</li>
                <li>You can test the full user flow</li>
              </ul>
            </div>
          )}

          {/* What's Next */}
          {!isTestPayment && (
            <div className="mt-6 rounded-xl bg-accent p-4 text-left text-sm text-accent-foreground">
              <strong>What happens next:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Your guarantors will receive email invitations</li>
                <li>Your challenge is now active</li>
                <li>Complete your challenge to get your deposit back</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="block w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full rounded-xl border border-border py-3 font-medium text-foreground transition-all duration-300 hover:bg-muted"
            >
              Return Home
            </Link>
            {isTestPayment && (
              <Link
                href="/challenges/new"
                className="block w-full rounded-xl border-2 border-dashed border-yellow-400 py-3 font-medium text-yellow-700 transition-all duration-300 hover:bg-yellow-50 dark:text-yellow-300 dark:hover:bg-yellow-900/20"
              >
                Create Another Test Challenge
              </Link>
            )}
          </div>

          {/* Session ID */}
          {sessionId && (
            <p className="mt-6 text-xs text-muted-foreground">
              Reference: {sessionId.slice(0, 30)}...
              {isTestPayment && " (TEST)"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DepositSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <DepositSuccessContent />
    </Suspense>
  );
}
