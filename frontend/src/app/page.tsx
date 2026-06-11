import Link from "next/link";

const MODES = [
  {
    href: "/play?mode=quick",
    title: "Quick Play",
    description: "5 random rounds across all of Kazakhstan",
  },
  {
    href: "/play?mode=daily",
    title: "Daily Challenge",
    description: "Same 5 places for everyone — one try per day",
  },
  {
    href: "/play?mode=infinite",
    title: "Infinite",
    description: "Keep guessing, build the longest streak",
  },
  {
    href: "/play?mode=landmark",
    title: "Landmarks",
    description: "Only famous places — great for beginners",
  },
  {
    href: "/play?mode=expert",
    title: "Expert",
    description: "Remote cities, steppe and hard-to-place spots",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 px-6 py-14">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Qaida</h1>
        <div className="h-px w-16 bg-accent" />
        <p className="text-muted">How well do you know Kazakhstan?</p>
        <p className="text-sm text-muted">
          Look around, pin the location on the map, score up to 5000 points per
          round.
        </p>
      </header>

      <Link
        href="/play?mode=quick"
        className="rounded-lg bg-accent py-3.5 text-center text-lg font-semibold text-background transition hover:bg-accent-strong active:scale-[0.99]"
      >
        Play
      </Link>

      <section aria-label="Game modes" className="space-y-2">
        {MODES.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="flex items-baseline justify-between gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3.5 transition hover:border-accent/50"
          >
            <span className="font-medium">{mode.title}</span>
            <span className="text-right text-sm text-muted">
              {mode.description}
            </span>
          </Link>
        ))}
        <Link
          href="/leaderboard"
          className="flex items-baseline justify-between gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3.5 transition hover:border-accent/50"
        >
          <span className="font-medium">My Stats</span>
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
  );
}
