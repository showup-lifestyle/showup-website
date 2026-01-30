"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-serif font-semibold">Something went wrong.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {error?.message || "Please try again in a moment."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 h-11 rounded-xl bg-foreground px-5 text-sm font-semibold text-background"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
