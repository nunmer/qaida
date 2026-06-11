"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GuessMap from "@/components/GuessMap";
import SatelliteSightPane from "@/components/SatelliteSightPane";
import ShareButton from "@/components/ShareButton";
import StreetViewPane, { streetViewEnabled } from "@/components/StreetViewPane";
import type { GameLocation } from "@/data/locations";
import { useI18n } from "@/lib/i18n";
import { ROUNDS_PER_GAME, todayKey, type GameMode } from "@/lib/rounds";
import { formatDistance } from "@/lib/scoring";
import type { Translations } from "@/lib/translations";
import { useDailyResult } from "@/lib/useStorage";
import { useGameStore } from "@/store/gameStore";

interface GameViewProps {
  mode: GameMode;
}

export default function GameView({ mode }: GameViewProps) {
  const { t } = useI18n();
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const dailyResult = useDailyResult(todayKey());
  const dailyBlocked = mode === "daily" && dailyResult !== null;

  useEffect(() => {
    if (dailyBlocked) return;
    startGame(mode);
  }, [mode, startGame, dailyBlocked]);

  if (dailyBlocked && status === "idle") {
    return <DailyAlreadyPlayed score={dailyResult.score} />;
  }
  if (status === "idle") {
    return (
      <div className="flex h-dvh items-center justify-center text-muted">
        {t.play.loading}
      </div>
    );
  }
  if (status === "finished") return <GameSummary />;
  return <RoundScreen />;
}

function DailyAlreadyPlayed({ score }: { score: number }) {
  const { t } = useI18n();

  return (
    <div className="bg-sky-gradient flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-2xl font-bold">
        {t.play.dailyDoneTitle}
      </h1>
      <p className="text-muted">
        {t.play.dailyDoneBody(score.toLocaleString())}
      </p>
      <div className="flex gap-3">
        <Link
          href="/play?mode=quick"
          className="shadow-accent-glow rounded-xl bg-accent px-6 py-3 font-display font-bold text-background transition hover:bg-accent-strong"
        >
          {t.play.quickGame}
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-border-subtle bg-surface/80 px-6 py-3 font-semibold backdrop-blur"
        >
          {t.play.home}
        </Link>
      </div>
    </div>
  );
}

function RoundScreen() {
  const { t } = useI18n();
  const {
    mode,
    rounds,
    roundIndex,
    results,
    totalScore,
    streak,
    pin,
    status,
    placePin,
    submitGuess,
    nextRound,
    quitToSummary,
  } = useGameStore();

  const location = rounds[roundIndex];
  const lastResult = status === "result" ? results[results.length - 1] : null;
  const totalRounds =
    mode === "infinite" ? null : Math.min(ROUNDS_PER_GAME, rounds.length);
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    // Fixed to the viewport: every child gets a definite height regardless of
    // page flow, so the map can never collapse to zero.
    <div className="fixed inset-0 flex flex-col bg-background">
      <header className="z-20 flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border-subtle bg-background/95 px-4 text-sm">
        <Link
          href="/"
          className="font-display font-bold uppercase tracking-wider text-accent-strong"
        >
          Qaida
        </Link>
        <span className="text-muted">
          {t.modes[mode].title} · {t.play.round} {roundIndex + 1}
          {totalRounds ? ` / ${totalRounds}` : ""}
        </span>
        <span className="flex items-center gap-3 font-medium tabular-nums">
          {streak > 1 && (
            <span className="text-gold" title={t.play.streak}>
              {t.play.streak} {streak}
            </span>
          )}
          <span aria-label="Total score">{totalScore.toLocaleString()}</span>
        </span>
      </header>

      <div className="relative min-h-0 flex-1">
        {/* Imagery fills the whole stage */}
        <RoundVisual key={location.id} location={location} />

        {/* Guess map: compact overlay, expands on hover (desktop) or toggle (mobile) */}
        {status === "guessing" && (
          <div
            className={`absolute bottom-3 right-3 z-10 flex flex-col gap-2 transition-all duration-200 ${
              mapExpanded
                ? "h-[min(60vh,30rem)] w-[calc(100vw-1.5rem)] max-w-2xl"
                : "h-56 w-72 sm:h-60 sm:w-80 sm:hover:h-[min(60vh,30rem)] sm:hover:w-[min(calc(100vw-1.5rem),42rem)]"
            }`}
          >
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border-subtle shadow-xl">
              {/* h-full (not absolute): maplibre's own CSS forces position:relative
                  on this element, which silently disables Tailwind's `absolute`. */}
              <GuessMap
                pin={pin}
                result={null}
                onPick={placePin}
                className="h-full w-full"
              />
              <button
                onClick={() => setMapExpanded((v) => !v)}
                className="absolute left-2 top-2 z-10 rounded bg-background/85 px-2 py-1 text-xs font-medium text-foreground"
                aria-label={mapExpanded ? t.play.shrink : t.play.expand}
              >
                {mapExpanded ? t.play.shrink : t.play.expand}
              </button>
            </div>
            <button
              onClick={submitGuess}
              disabled={!pin}
              className="rounded-lg bg-accent py-2.5 font-semibold text-background shadow-md transition enabled:hover:bg-accent-strong enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pin ? t.play.submit : t.play.placePin}
            </button>
          </div>
        )}

        {/* Result: full-screen map with guess vs. actual, plus info card */}
        {lastResult && (
          <div className="absolute inset-0 z-10">
            <GuessMap
              pin={null}
              result={{
                guess: { lat: lastResult.guessLat, lng: lastResult.guessLng },
                actual: {
                  lat: lastResult.location.lat,
                  lng: lastResult.location.lng,
                },
              }}
              onPick={() => undefined}
              className="h-full w-full"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-border-subtle bg-surface/95 p-4 backdrop-blur">
              <div className="mx-auto max-w-xl space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-lg font-bold">
                    {lastResult.location.name}
                    {lastResult.isPerfect && (
                      <span className="ml-2 inline-block -translate-y-0.5 rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 align-middle text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                        {t.play.perfect}
                      </span>
                    )}
                  </h2>
                  <span className="text-gold-glow font-display text-2xl font-bold tabular-nums text-gold">
                    +{lastResult.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {lastResult.location.city}, {lastResult.location.region} —{" "}
                  {t.play.guessDistance(formatDistance(lastResult.distanceKm))}
                  {lastResult.bonus > 0 && (
                    <> · {t.play.speedBonus(lastResult.bonus)}</>
                  )}
                  {lastResult.multiplier > 1 && (
                    <>
                      {" "}
                      ·{" "}
                      {t.play.streakMultiplier(
                        lastResult.multiplier.toFixed(1),
                      )}
                    </>
                  )}
                </p>
                <p className="rounded-lg border-l-2 border-sand/50 bg-sand/5 px-3 py-2 text-sm leading-relaxed text-sand">
                  {lastResult.location.fact}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={nextRound}
                    className="flex-1 rounded-lg bg-accent py-2.5 font-semibold text-background transition hover:bg-accent-strong active:scale-[0.99]"
                  >
                    {mode !== "infinite" &&
                    roundIndex + 1 >= Math.min(ROUNDS_PER_GAME, rounds.length)
                      ? t.play.seeResults
                      : t.play.nextRound}
                  </button>
                  {mode === "infinite" && (
                    <button
                      onClick={quitToSummary}
                      className="rounded-lg border border-border-subtle bg-surface-2 px-4 py-2.5 font-medium"
                    >
                      {t.play.finish}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Full-stage round imagery, best available first:
 * 1. Street View 360° panorama (incl. photospheres at sights)
 * 2. Label-free satellite view of the sight
 * 3. Location photo (no API key, or Google unreachable)
 */
function RoundVisual({ location }: { location: GameLocation }) {
  const [streetViewFailed, setStreetViewFailed] = useState(false);
  const [satelliteFailed, setSatelliteFailed] = useState(false);
  const googleEnabled = streetViewEnabled();

  let pane: React.ReactNode;
  if (googleEnabled && !streetViewFailed) {
    pane = (
      <StreetViewPane
        lat={location.lat}
        lng={location.lng}
        onUnavailable={() => setStreetViewFailed(true)}
        className="h-full w-full"
      />
    );
  } else if (googleEnabled && !satelliteFailed) {
    pane = (
      <SatelliteSightPane
        lat={location.lat}
        lng={location.lng}
        onUnavailable={() => setSatelliteFailed(true)}
        className="h-full w-full"
      />
    );
  } else {
    pane = <RoundPhoto location={location} />;
  }

  return <div className="absolute inset-0 overflow-hidden bg-black">{pane}</div>;
}

function RoundPhoto({ location }: { location: GameLocation }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        Image unavailable — guess by intuition
      </div>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={location.imageUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={location.imageUrl}
        alt="Where in Kazakhstan is this?"
        className="relative h-full w-full object-contain"
        onError={() => setBroken(true)}
      />
    </>
  );
}

/** Playful rank based on average score per round (max 5000). */
function rankTitle(
  totalScore: number,
  rounds: number,
  t: Translations,
): string {
  const avg = rounds > 0 ? totalScore / rounds : 0;
  if (avg >= 4500) return t.ranks.legend;
  if (avg >= 3500) return t.ranks.pathfinder;
  if (avg >= 2500) return t.ranks.explorer;
  if (avg >= 1500) return t.ranks.traveler;
  return t.ranks.tourist;
}

function GameSummary() {
  const { t } = useI18n();
  const { mode, results, totalScore, bestStreak, startGame } = useGameStore();

  return (
    <div className="bg-sky-gradient flex min-h-dvh w-full flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-6">
        <header className="space-y-2 pt-8 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            {t.modes[mode].title} {t.summary.complete}
          </p>
          <h1 className="text-gold-glow font-display text-7xl font-bold tabular-nums text-gold">
            {totalScore.toLocaleString()}
          </h1>
          <p className="font-display text-lg font-bold text-sand">
            {rankTitle(totalScore, results.length, t)}
          </p>
          <p className="text-sm text-muted">
            {t.summary.line(results.length, bestStreak)}
          </p>
        </header>

        <ul className="space-y-2">
          {results.map((r, i) => (
            <li
              key={`${r.location.id}-${i}`}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface/80 px-4 py-3 backdrop-blur"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{r.location.city}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums ${
                    r.isClose
                      ? "border-accent/40 bg-accent/10 text-accent-strong"
                      : "border-danger/40 bg-danger/10 text-danger"
                  }`}
                >
                  {formatDistance(r.distanceKm)}
                </span>
              </span>
              <span className="font-display font-bold tabular-nums">
                {r.total.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 pb-4">
          <ShareButton
            score={totalScore}
            distancesKm={results.map((r) => r.distanceKm)}
          />
          {mode !== "daily" && (
            <button
              onClick={() => startGame(mode)}
              className="shadow-accent-glow rounded-xl bg-accent py-3 font-display font-bold text-background transition hover:bg-accent-strong active:scale-[0.99]"
            >
              {t.summary.playAgain}
            </button>
          )}
          <Link
            href="/"
            className="rounded-xl border border-border-subtle bg-surface/80 py-3 text-center font-medium backdrop-blur"
          >
            {t.play.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
