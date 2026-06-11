"use client";

import Link from "next/link";
import { MODE_LABELS } from "@/lib/rounds";
import { formatDistance } from "@/lib/scoring";
import { useStats } from "@/lib/useStorage";

export default function LeaderboardPage() {
  const stats = useStats();

  const avgScore =
    stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

  return (
    <div className="bg-sky-gradient flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-8">
        <header className="space-y-2">
          <Link
            href="/"
            className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent-strong"
          >
            ← Qaida
          </Link>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
            My Stats
          </h1>
          <div className="h-px w-16 bg-accent" />
          <p className="text-sm text-muted">
            Stored on this device. Global leaderboards arrive with accounts in
            a future update.
          </p>
        </header>

        {stats.gamesPlayed === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border-subtle bg-surface/80 p-8 text-center backdrop-blur">
            <p className="text-muted">No games yet — play your first round.</p>
            <Link
              href="/play?mode=quick"
              className="shadow-accent-glow rounded-xl bg-accent px-8 py-3 font-display font-bold text-background transition hover:bg-accent-strong"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Best score"
                value={stats.bestScore.toLocaleString()}
                highlight
              />
              <StatCard label="Games" value={String(stats.gamesPlayed)} />
              <StatCard label="Best streak" value={String(stats.bestStreak)} />
              <StatCard label="Avg score" value={avgScore.toLocaleString()} />
            </section>

            <section className="space-y-2">
              <h2 className="font-display font-bold uppercase tracking-wider">
                Recent games
              </h2>
              <ul className="space-y-2">
                {stats.history.map((game, i) => (
                  <li
                    key={`${game.playedAt}-${i}`}
                    className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface/80 px-4 py-3 text-sm backdrop-blur"
                  >
                    <span>
                      <span className="font-display font-bold">
                        {MODE_LABELS[game.mode]}
                      </span>
                      <span className="ml-2 text-muted">
                        {game.rounds} rounds · avg{" "}
                        {formatDistance(game.avgDistanceKm)}
                      </span>
                    </span>
                    <span className="font-display font-bold tabular-nums text-gold">
                      {game.score.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-surface/80 p-4 text-center backdrop-blur ${
        highlight ? "border-gold/40" : "border-border-subtle"
      }`}
    >
      <p
        className={`font-display text-xl font-bold tabular-nums ${
          highlight ? "text-gold-glow text-gold" : ""
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
