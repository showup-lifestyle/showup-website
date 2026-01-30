"use client";

import { useState } from "react";

type WaitlistStatus = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to join the waitlist.");
      }

      setStatus("success");
      setMessage("You are on the waitlist. Check your inbox for confirmation.");
      setName("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-border/70 bg-white/80 p-6 shadow-xl shadow-black/5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-foreground">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="h-11 rounded-xl border border-border/60 bg-white px-4 text-base shadow-sm outline-none transition focus:border-foreground/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-foreground">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            required
            className="h-11 rounded-xl border border-border/60 bg-white px-4 text-base shadow-sm outline-none transition focus:border-foreground/40"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-xl bg-foreground text-base font-semibold text-background shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Joining..." : "Join the waitlist"}
      </button>
      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
