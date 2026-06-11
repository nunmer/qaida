import type { GameMode } from "@/lib/rounds";

export interface GameRecord {
  mode: GameMode;
  score: number;
  rounds: number;
  bestStreak: number;
  avgDistanceKm: number;
  dateKey: string;
  playedAt: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  bestStreak: number;
  perfectGuesses: number;
  history: GameRecord[];
}

const STATS_KEY = "qaida.stats.v1";
const DAILY_KEY = "qaida.daily.v1";
const MAX_HISTORY = 50;

export const EMPTY_STATS: PlayerStats = {
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  bestStreak: 0,
  perfectGuesses: 0,
  history: [],
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Module-level caches keep snapshots referentially stable so the store can be
 * consumed with useSyncExternalStore.
 */
let statsCache: PlayerStats | null = null;
let dailyCache: { key: string; value: DailyResult | null } | null = null;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function loadStats(): PlayerStats {
  if (!isBrowser()) return EMPTY_STATS;
  if (statsCache) return statsCache;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) {
      statsCache = EMPTY_STATS;
    } else {
      const parsed = JSON.parse(raw) as Partial<PlayerStats>;
      statsCache = { ...EMPTY_STATS, ...parsed, history: parsed.history ?? [] };
    }
  } catch {
    statsCache = EMPTY_STATS;
  }
  return statsCache;
}

export function recordGame(
  record: GameRecord,
  perfectGuesses: number,
): PlayerStats {
  const prev = loadStats();
  const next: PlayerStats = {
    gamesPlayed: prev.gamesPlayed + 1,
    totalScore: prev.totalScore + record.score,
    bestScore: Math.max(prev.bestScore, record.score),
    bestStreak: Math.max(prev.bestStreak, record.bestStreak),
    perfectGuesses: prev.perfectGuesses + perfectGuesses,
    history: [record, ...prev.history].slice(0, MAX_HISTORY),
  };
  statsCache = next;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
    } catch {
      // storage full or blocked — stats just won't persist
    }
  }
  notify();
  return next;
}

export interface DailyRoundSummary {
  city: string;
  distanceKm: number;
  total: number;
}

export interface DailyResult {
  dateKey: string;
  score: number;
  /** Per-round details; absent in results saved by older versions. */
  rounds?: DailyRoundSummary[];
  bestStreak?: number;
}

export function loadDailyResult(dateKey: string): DailyResult | null {
  if (!isBrowser()) return null;
  if (dailyCache?.key === dateKey) return dailyCache.value;
  let value: DailyResult | null = null;
  try {
    const raw = window.localStorage.getItem(DAILY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyResult;
      value = parsed.dateKey === dateKey ? parsed : null;
    }
  } catch {
    value = null;
  }
  dailyCache = { key: dateKey, value };
  return value;
}

export function saveDailyResult(result: DailyResult): void {
  dailyCache = { key: result.dateKey, value: result };
  if (isBrowser()) {
    try {
      window.localStorage.setItem(DAILY_KEY, JSON.stringify(result));
    } catch {
      // non-fatal
    }
  }
  notify();
}
