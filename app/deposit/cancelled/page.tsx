"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function DepositCancelledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl neumorphic p-8 text-center">
          {/* Cancelled Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <XCircle className="h-10 w-10 text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your payment was cancelled and no charges were made.
          </p>

          {/* Info */}
          <div className="mt-6 rounded-xl bg-accent p-4 text-left text-sm text-accent-foreground">
            <p>
              No worries! You can start a new challenge anytime. Your progress and
              any previous challenges are still safe.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Link
              href="/challenges/new"
              className="block w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.02]"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full rounded-xl border border-border py-3 font-medium text-foreground transition-all duration-300 hover:bg-muted"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
