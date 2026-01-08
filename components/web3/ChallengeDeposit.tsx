"use client";

import { useState, useCallback, useMemo } from "react";
import { StripeCheckout } from "./StripeCheckout";
import { cn } from "@/lib/utils";
import { DollarSign, Users, CreditCard, X, Check } from "lucide-react";

type DepositStep = "amount" | "guarantors" | "payment";

interface ChallengeDepositProps {
  challengeTitle: string;
  challengeDescription: string;
  challengeDuration: number; // in days
  metadataUri: string;
  onComplete?: (challengeId: string) => void;
  className?: string;
}

/**
 * Simplified challenge deposit flow component
 * Handles: Amount selection -> Guarantors -> Payment (Credit Card/Apple Pay)
 * 
 * After payment, the backend webhook creates the smart contract and releases
 * funds to the user's challenge escrow.
 */
export function ChallengeDeposit({
  challengeTitle,
  challengeDescription,
  challengeDuration,
  metadataUri,
  onComplete,
  className,
}: ChallengeDepositProps) {
  // Form state
  const [step, setStep] = useState<DepositStep>("amount");
  const [depositAmount, setDepositAmount] = useState<string>("100");
  const [guarantors, setGuarantors] = useState<string[]>([""]);

  // Generate a unique challenge ID for this session
  const challengeId = useMemo(() => {
    return `challenge_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }, []);

  // Validate guarantors (email addresses)
  const validGuarantors = useMemo(() => {
    return guarantors.filter((g) => g.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
  }, [guarantors]);

  // Handle guarantor input changes
  const updateGuarantor = useCallback((index: number, value: string) => {
    setGuarantors((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const addGuarantor = useCallback(() => {
    if (guarantors.length < 10) {
      setGuarantors((prev) => [...prev, ""]);
    }
  }, [guarantors.length]);

  const removeGuarantor = useCallback(
    (index: number) => {
      if (guarantors.length > 1) {
        setGuarantors((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [guarantors.length],
  );

  return (
    <div className={cn("rounded-2xl neumorphic p-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {challengeTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">{challengeDescription}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{challengeDuration} day challenge</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(
            [
              { key: "amount", icon: DollarSign, label: "Amount" },
              { key: "guarantors", icon: Users, label: "Friends" },
              { key: "payment", icon: CreditCard, label: "Payment" },
            ] as const
          ).map(({ key, icon: Icon, label }, i) => (
            <div key={key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                    step === key || getStepIndex(step) > i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs text-muted-foreground hidden sm:block">
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={cn(
                    "h-1 w-12 sm:w-16 md:w-24 transition-all duration-300 mt-[-1rem] sm:mt-[-1.5rem]",
                    getStepIndex(step) > i ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {/* Step 1: Select Amount */}
        {step === "amount" && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Deposit Amount (USD)
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-lg font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all duration-300"
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {[25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                      depositAmount === amount.toString()
                        ? "bg-primary text-primary-foreground"
                        : "neumorphic-inset hover:bg-muted",
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <p className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
              This amount will be held in a smart contract until you complete
              your challenge or your guarantors vote on your Path of Redemption.
            </p>

            <button
              onClick={() => setStep("guarantors")}
              disabled={!depositAmount || parseFloat(depositAmount) < 1}
              className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Add Guarantors */}
        {step === "guarantors" && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Guarantor Email Addresses
              </label>
              <p className="mt-1 text-sm text-muted-foreground">
                These friends will verify your challenge and can vote on your
                Path of Redemption if you fail. They&apos;ll receive an email invitation.
              </p>

              <div className="mt-4 space-y-3">
                {guarantors.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="email"
                      value={g}
                      onChange={(e) => updateGuarantor(i, e.target.value)}
                      placeholder="friend@example.com"
                      className={cn(
                        "flex-1 rounded-xl border bg-background py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-all duration-300",
                        g && !g.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                          ? "border-destructive focus:ring-destructive/20"
                          : "border-border focus:border-primary focus:ring-ring/20",
                      )}
                    />
                    {g.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {guarantors.length > 1 && (
                      <button
                        onClick={() => removeGuarantor(i)}
                        className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {guarantors.length < 10 && (
                <button
                  onClick={addGuarantor}
                  className="mt-3 text-sm font-medium text-primary hover:underline transition-all duration-300"
                >
                  + Add another guarantor
                </button>
              )}
            </div>

            <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
              <strong>Tip:</strong> Choose an odd number of guarantors (1, 3, 5)
              to avoid tie votes. A majority is required to approve your Path of
              Redemption.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 rounded-xl border border-border py-3 font-medium text-foreground neumorphic-inset hover:bg-muted transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep("payment")}
                disabled={validGuarantors.length === 0}
                className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue ({validGuarantors.length} guarantor
                {validGuarantors.length !== 1 ? "s" : ""})
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-lg font-serif font-semibold">
                Complete Your Payment
              </h3>
              <p className="mt-1 text-muted-foreground">
                Pay ${depositAmount} to start your challenge. We accept credit cards and Apple Pay.
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-muted p-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${depositAmount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{challengeDuration} days</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Guarantors</span>
                <span className="font-medium">{validGuarantors.length}</span>
              </div>
            </div>

            <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
              <strong>How it works:</strong> After payment, we&apos;ll create a secure smart contract
              to hold your funds. Your guarantors will be notified, and your challenge will begin!
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep("guarantors")}
              className="w-full rounded-xl border border-border py-3 font-medium text-foreground neumorphic-inset hover:bg-muted transition-all duration-300 mb-3"
            >
              Back
            </button>

            {/* Stripe Checkout */}
            <StripeCheckout
              amount={parseFloat(depositAmount)}
              challengeId={challengeId}
              metadata={{
                challengeTitle,
                challengeDuration: challengeDuration.toString(),
                metadataUri,
                guarantors: JSON.stringify(validGuarantors),
              }}
              onError={(error) => console.error("Checkout error:", error)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function
function getStepIndex(step: DepositStep): number {
  const steps: DepositStep[] = ["amount", "guarantors", "payment"];
  return steps.indexOf(step);
}

export default ChallengeDeposit;
