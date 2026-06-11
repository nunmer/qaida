import Image from "next/image";
import Link from "next/link";

const MODES = [
  {
    href: "/play?mode=quick",
    title: "Quick Play",
    tag: "5 rounds",
    description: "Random places across all of Kazakhstan",
    gold: false,
  },
  {
    href: "/play?mode=daily",
    title: "Daily Challenge",
    tag: "one try",
    description: "Same 5 places for everyone, every day",
    gold: true,
  },
  {
    href: "/play?mode=infinite",
    title: "Infinite",
    tag: "∞",
    description: "Keep guessing, build the longest streak",
    gold: false,
  },
  {
    href: "/play?mode=landmark",
    title: "Landmarks",
    tag: "easy",
    description: "Only famous places — great for beginners",
    gold: false,
  },
  {
    href: "/play?mode=expert",
    title: "Expert",
    tag: "hard",
    description: "Remote cities, steppe and hard-to-place spots",
    gold: false,
  },
] as const;

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Cinematic backdrop: Charyn Canyon fading into the steppe night */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/locations/charyn-canyon.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/75 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(11,17,24,0.9),transparent)]" />
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pb-10 pt-20 sm:pt-28">
        {/* Hero */}
        <header className="mb-12 space-y-4">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            Recognize Kazakhstan
          </p>
          <h1 className="font-display text-7xl font-bold uppercase tracking-tight sm:text-8xl">
            Qaida
          </h1>
          <p className="max-w-md text-xl leading-snug text-sand">
            &ldquo;Wait, I know this place&hellip;&rdquo;
          </p>
          <p className="max-w-md text-sm leading-relaxed text-foreground/80">
            Drop into a place somewhere in Kazakhstan. Look around, pin it on
            the map — the closer you are, the more you score.
          </p>
        </header>

        {/* Primary CTA */}
        <div className="mb-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/play?mode=quick"
            className="shadow-accent-glow rounded-xl bg-accent px-10 py-4 text-center font-display text-lg font-bold text-background transition hover:bg-accent-strong active:scale-[0.99]"
          >
            Start exploring
          </Link>
          <Link
            href="/play?mode=daily"
            className="rounded-xl border border-gold/60 bg-background/40 px-10 py-4 text-center font-display text-lg font-bold text-gold backdrop-blur transition hover:border-gold hover:bg-gold/10 active:scale-[0.99]"
          >
            Daily Challenge
          </Link>
        </div>

        {/* Mode cards */}
        <section aria-label="Game modes" className="grid gap-3 sm:grid-cols-2">
          {MODES.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`group rounded-xl border bg-surface/70 p-4 backdrop-blur transition hover:-translate-y-0.5 ${
                mode.gold
                  ? "border-gold/40 hover:border-gold hover:shadow-[0_8px_24px_rgba(214,168,79,0.15)]"
                  : "border-border-subtle hover:border-accent/70 hover:shadow-[0_8px_24px_rgba(0,166,166,0.15)]"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span
                  className={`font-display font-bold ${
                    mode.gold ? "text-gold" : "group-hover:text-accent-strong"
                  }`}
                >
                  {mode.title}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${
                    mode.gold
                      ? "border-gold/40 text-gold"
                      : "border-border-subtle text-muted"
                  }`}
                >
                  {mode.tag}
                </span>
              </div>
              <p className="text-sm text-muted">{mode.description}</p>
            </Link>
          ))}
          <Link
            href="/leaderboard"
            className="group rounded-xl border border-border-subtle bg-surface/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_8px_24px_rgba(0,166,166,0.15)]"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-display font-bold group-hover:text-accent-strong">
                My Stats
              </span>
              <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                you
              </span>
            </div>
            <p className="text-sm text-muted">
              Best scores, streaks, recent games
            </p>
          </Link>
        </section>

        <footer className="mt-auto pt-12 text-xs text-muted/80">
          Imagery: Google Street View / Wikimedia Commons · Map: ©
          OpenStreetMap contributors
        </footer>
      </main>
    </div>
  );
}
