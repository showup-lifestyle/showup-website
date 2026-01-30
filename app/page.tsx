import Image from "next/image";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff2d6,_transparent_55%),radial-gradient(circle_at_bottom,_#e6f5ff,_transparent_60%),linear-gradient(135deg,_#fff7eb,_#f6f1ff_55%,_#e8f3ff)] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-white/70 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Join the waitlist
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Image
            src="/showup-icon.svg"
            alt="Showup"
            width={88}
            height={88}
            className="drop-shadow-md"
          />
        </div>

        <h1 className="mt-8 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Show up for your goals with real accountability.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Showup turns personal challenges into commitments. Join the waitlist
          and get first access when we launch.
        </p>

        <WaitlistForm />

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          Early access. No spam. Ever.
        </p>
      </div>
    </main>
  );
}
