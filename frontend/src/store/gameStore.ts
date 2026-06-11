import { create } from "zustand";
import type { GameLocation } from "@/data/locations";
import {
  type GameMode,
  ROUNDS_PER_GAME,
  pickInfiniteBatch,
  pickRounds,
  todayKey,
} from "@/lib/rounds";
import { type RoundScore, scoreRound } from "@/lib/scoring";
import { recordGame, saveDailyResult } from "@/lib/storage";

export interface RoundResult extends RoundScore {
  location: GameLocation;
  guessLat: number;
  guessLng: number;
}

export type GameStatus = "idle" | "guessing" | "result" | "finished";

interface GameState {
  status: GameStatus;
  mode: GameMode;
  rounds: GameLocation[];
  roundIndex: number;
  results: RoundResult[];
  totalScore: number;
  streak: number;
  bestStreak: number;
  pin: { lat: number; lng: number } | null;
  roundStartedAt: number;

  startGame: (mode: GameMode) => void;
  placePin: (lat: number, lng: number) => void;
  submitGuess: () => void;
  nextRound: () => void;
  quitToSummary: () => void;
  reset: () => void;
}

const initial = {
  status: "idle" as GameStatus,
  mode: "quick" as GameMode,
  rounds: [] as GameLocation[],
  roundIndex: 0,
  results: [] as RoundResult[],
  totalScore: 0,
  streak: 0,
  bestStreak: 0,
  pin: null,
  roundStartedAt: 0,
};

function finishStats(state: Pick<GameState, "mode" | "results" | "totalScore" | "bestStreak">) {
  const perfects = state.results.filter((r) => r.isPerfect).length;
  const avgDistance =
    state.results.length > 0
      ? state.results.reduce((sum, r) => sum + r.distanceKm, 0) / state.results.length
      : 0;
  const dateKey = todayKey();
  recordGame(
    {
      mode: state.mode,
      score: state.totalScore,
      rounds: state.results.length,
      bestStreak: state.bestStreak,
      avgDistanceKm: Math.round(avgDistance),
      dateKey,
      playedAt: new Date().toISOString(),
    },
    perfects,
  );
  if (state.mode === "daily") {
    saveDailyResult({ dateKey, score: state.totalScore });
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initial,

  startGame: (mode) => {
    const rounds =
      mode === "infinite" ? pickInfiniteBatch([]) : pickRounds(mode);
    set({
      ...initial,
      status: "guessing",
      mode,
      rounds,
      roundStartedAt: Date.now(),
    });
  },

  placePin: (lat, lng) => {
    if (get().status !== "guessing") return;
    set({ pin: { lat, lng } });
  },

  submitGuess: () => {
    const state = get();
    if (state.status !== "guessing" || !state.pin) return;
    const location = state.rounds[state.roundIndex];
    const seconds = (Date.now() - state.roundStartedAt) / 1000;
    const score = scoreRound(
      state.pin.lat,
      state.pin.lng,
      location.lat,
      location.lng,
      seconds,
      state.streak,
    );
    const streak = score.isClose ? state.streak + 1 : 0;
    set({
      status: "result",
      results: [
        ...state.results,
        { ...score, location, guessLat: state.pin.lat, guessLng: state.pin.lng },
      ],
      totalScore: state.totalScore + score.total,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
    });
  },

  nextRound: () => {
    const state = get();
    if (state.status !== "result") return;

    const isLastRound =
      state.mode !== "infinite" &&
      state.roundIndex + 1 >= Math.min(ROUNDS_PER_GAME, state.rounds.length);
    if (isLastRound) {
      finishStats(state);
      set({ status: "finished" });
      return;
    }

    let rounds = state.rounds;
    if (state.mode === "infinite" && state.roundIndex + 1 >= rounds.length) {
      rounds = [...rounds, ...pickInfiniteBatch(rounds.slice(-10).map((r) => r.id))];
    }
    set({
      status: "guessing",
      rounds,
      roundIndex: state.roundIndex + 1,
      pin: null,
      roundStartedAt: Date.now(),
    });
  },

  quitToSummary: () => {
    const state = get();
    if (state.results.length === 0) {
      set({ ...initial });
      return;
    }
    finishStats(state);
    set({ status: "finished" });
  },

  reset: () => set({ ...initial }),
}));
