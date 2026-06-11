"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GameView from "@/components/GameView";
import type { GameMode } from "@/lib/rounds";

const VALID_MODES: GameMode[] = [
  "quick",
  "daily",
  "infinite",
  "landmark",
  "expert",
];

function PlayContent() {
  const params = useSearchParams();
  const raw = params.get("mode") ?? "quick";
  const mode: GameMode = VALID_MODES.includes(raw as GameMode)
    ? (raw as GameMode)
    : "quick";
  return <GameView mode={mode} />;
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-muted">
          Loading…
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
