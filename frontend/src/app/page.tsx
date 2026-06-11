import Link from "next/link";

const MODES = [
  {
    href: "/play?mode=quick",
    title: "Quick Play",
    description: "5 random rounds across all of Kazakhstan",
    gold: false,
  },
  {
    href: "/play?mode=daily",
    title: "Daily Challenge",
    description: "Same 5 places for everyone — one try per day",
    gold: true,
  },
  {
    href: "/play?mode=infinite",
    title: "Infinite",
    description: "Keep guessing, build the longest streak",
    gold: false,
  },
  {
    href: "/play?mode=landmark",
    title: "Landmarks",
    description: "Only famous places — great for beginners",
    gold: false,
  },
  {
    href: "/play?mode=expert",
    title: "Expert",
    description: "Remote cities, steppe and hard-to-place spots",
    gold: false,
  },
] as const;

export default function Home() {
  return (
    <div className="bg-sky-gradient flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 px-6 py-14">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-strong">
            Recognize Kazakhstan
          </p>
          <h1 className="text-5xl font-bold tracking-tight">Qaida</h1>
          <div className="h-px w-16 bg-accent" />
          <p className="text-lg text-sand">&ldquo;Wait, I know this place&hellip;&rdquo;</p>
          <p className="text-sm text-muted">
            Look around, pin the location on the map, score up to 5000 points
            per round.
          </p>
        </header>

        <Link
          href="/play?mode=quick"
          className="rounded-xl bg-accent py-3.5 text-center text-lg font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-strong active:scale-[0.99]"
        >
          Start exploring
        </Link>

        <section aria-label="Game modes" className="space-y-2">
          {MODES.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`group flex items-baseline justify-between gap-4 rounded-xl border bg-surface/80 px-4 py-3.5 backdrop-blur transition ${
                mode.gold
                  ? "border-gold/40 hover:border-gold"
                  : "border-border-subtle hover:border-accent/60"
              }`}
            >
              <span
                className={`font-medium transition ${
                  mode.gold
                    ? "text-gold"
                    : "group-hover:text-accent-strong"
                }`}
              >
                {mode.title}
              </span>
              <span className="text-right text-sm text-muted">
                {mode.description}
              </span>
            </Link>
          ))}
          <Link
            href="/leaderboard"
            className="group flex items-baseline justify-between gap-4 rounded-xl border border-border-subtle bg-surface/80 px-4 py-3.5 backdrop-blur transition hover:border-accent/60"
          >
            <span className="font-medium transition group-hover:text-accent-strong">
              My Stats
            </span>
            <span className="text-right text-sm text-muted">
              Best scores, streaks, recent games
            </span>
          </Link>
        </section>

        <footer className="mt-auto text-xs text-muted">
          Imagery: Google Street View / Wikimedia Commons · Map: ©
          OpenStreetMap contributors
        </footer>
      </main>
    </div>
  );
}
