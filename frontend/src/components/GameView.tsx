"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GuessMap from "@/components/GuessMap";
import SatelliteSightPane from "@/components/SatelliteSightPane";
import ShareButton from "@/components/ShareButton";
import StreetViewPane, { streetViewEnabled } from "@/components/StreetViewPane";
import type { GameLocation } from "@/data/locations";
import { MODE_LABELS, ROUNDS_PER_GAME, todayKey, type GameMode } from "@/lib/rounds";
import { formatDistance } from "@/lib/scoring";
import { useDailyResult } from "@/lib/useStorage";
import { useGameStore } from "@/store/gameStore";

interface GameViewProps {
  mode: GameMode;
}

export default function GameView({ mode }: GameViewProps) {
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
        Loading…
      </div>
    );
  }
  if (status === "finished") return <GameSummary />;
  return <RoundScreen />;
}

function DailyAlreadyPlayed({ score }: { score: number }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Daily Challenge complete</h1>
      <p className="text-muted">
        You scored{" "}
        <span className="font-semibold text-gold">{score.toLocaleString()}</span>{" "}
        today. A new challenge arrives at midnight.
      </p>
      <div className="flex gap-3">
        <Link
          href="/play?mode=quick"
          className="rounded-lg bg-accent px-6 py-3 font-semibold text-background"
        >
          Quick Game
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-border-subtle bg-surface px-6 py-3 font-semibold"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

function RoundScreen() {
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
        <Link href="/" className="font-semibold text-accent-strong">
          Qaida
        </Link>
        <span className="text-muted">
          {MODE_LABELS[mode]} · Round {roundIndex + 1}
          {totalRounds ? ` of ${totalRounds}` : ""}
        </span>
        <span className="flex items-center gap-3 font-medium tabular-nums">
          {streak > 1 && (
            <span className="text-gold" title="Close-guess streak">
              streak {streak}
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
                aria-label={mapExpanded ? "Shrink map" : "Expand map"}
              >
                {mapExpanded ? "Shrink" : "Expand"}
              </button>
            </div>
            <button
              onClick={submitGuess}
              disabled={!pin}
              className="rounded-lg bg-accent py-2.5 font-semibold text-background shadow-md transition enabled:hover:bg-accent-strong enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pin ? "Submit guess" : "Place your pin on the map"}
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
                  <h2 className="text-lg font-semibold">
                    {lastResult.location.name}
                    {lastResult.isPerfect && (
                      <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide text-gold">
                        perfect
                      </span>
                    )}
                  </h2>
                  <span className="text-xl font-bold tabular-nums text-gold">
                    +{lastResult.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {lastResult.location.city}, {lastResult.location.region} —
                  your guess was{" "}
                  <span className="font-medium text-foreground">
                    {formatDistance(lastResult.distanceKm)}
                  </span>{" "}
                  away
                  {lastResult.bonus > 0 && (
                    <> · speed bonus +{lastResult.bonus}</>
                  )}
                  {lastResult.multiplier > 1 && (
                    <> · streak ×{lastResult.multiplier.toFixed(1)}</>
                  )}
                </p>
                <p className="text-sm leading-relaxed">
                  {lastResult.location.fact}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={nextRound}
                    className="flex-1 rounded-lg bg-accent py-2.5 font-semibold text-background transition hover:bg-accent-strong active:scale-[0.99]"
                  >
                    {mode !== "infinite" &&
                    roundIndex + 1 >= Math.min(ROUNDS_PER_GAME, rounds.length)
                      ? "See results"
                      : "Next round"}
                  </button>
                  {mode === "infinite" && (
                    <button
                      onClick={quitToSummary}
                      className="rounded-lg border border-border-subtle bg-surface-2 px-4 py-2.5 font-medium"
                    >
                      Finish
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

function GameSummary() {
  const { mode, results, totalScore, bestStreak, startGame } = useGameStore();
  const cities = results.map((r) => ({
    name: r.location.city,
    close: r.isClose,
  }));

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 p-6">
      <header className="space-y-1 text-center">
        <p className="text-sm uppercase tracking-widest text-muted">
          {MODE_LABELS[mode]} complete
        </p>
        <h1 className="text-5xl font-bold tabular-nums text-gold">
          {totalScore.toLocaleString()}
        </h1>
        <p className="text-muted">
          {results.length} rounds · best streak {bestStreak}
        </p>
      </header>

      <ul className="space-y-2">
        {results.map((r, i) => (
          <li
            key={`${r.location.id}-${i}`}
            className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface px-4 py-3"
          >
            <span>
              {r.location.city}
              <span
                className={`ml-2 text-xs ${r.isClose ? "text-accent-strong" : "text-danger"}`}
              >
                {formatDistance(r.distanceKm)}
              </span>
            </span>
            <span className="font-medium tabular-nums">
              {r.total.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <ShareButton score={totalScore} mode={mode} cities={cities} />
        {mode !== "daily" && (
          <button
            onClick={() => startGame(mode)}
            className="rounded-lg bg-accent py-3 font-semibold text-background transition hover:bg-accent-strong active:scale-[0.99]"
          >
            Play again
          </button>
        )}
        <Link
          href="/"
          className="rounded-lg border border-border-subtle bg-surface py-3 text-center font-medium"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
