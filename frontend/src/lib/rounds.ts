import {
  EXPERT_POOL,
  LANDMARK_POOL,
  LOCATIONS,
  type GameLocation,
} from "@/data/locations";

export type GameMode = "quick" | "daily" | "infinite" | "landmark" | "expert" | "room";

export const ROUNDS_PER_GAME = 5;

/** Deterministic PRNG (mulberry32) so every player gets the same daily game. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Local date key like "2026-06-11" — daily resets at the player's midnight. */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function poolForMode(mode: GameMode): readonly GameLocation[] {
  if (mode === "landmark") return LANDMARK_POOL;
  if (mode === "expert") return EXPERT_POOL;
  return LOCATIONS;
}

/**
 * Picks the locations for a game. Daily mode is seeded by the calendar date,
 * so all players worldwide see the same five rounds; other modes are random.
 */
export function pickRounds(mode: GameMode, count = ROUNDS_PER_GAME): GameLocation[] {
  const pool = poolForMode(mode);
  const seed =
    mode === "daily"
      ? hashString(`qaida-daily-${todayKey()}`)
      : Math.floor(Math.random() * 2 ** 31);
  const rng = mulberry32(seed);
  return shuffled(pool, rng).slice(0, Math.min(count, pool.length));
}

/**
 * Multiplayer room: the room code seeds the PRNG, so everyone who opens the
 * same invite link gets the identical five places — same trick as daily mode,
 * but keyed on the shared room code instead of the calendar date.
 */
export function pickRoomRounds(
  roomCode: string,
  count = ROUNDS_PER_GAME,
): GameLocation[] {
  const rng = mulberry32(hashString(`qaida-room-${roomCode}`));
  return shuffled(LOCATIONS, rng).slice(0, Math.min(count, LOCATIONS.length));
}

/** Infinite mode: deals a fresh shuffled batch, avoiding immediate repeats. */
export function pickInfiniteBatch(excludeIds: readonly string[]): GameLocation[] {
  const rng = mulberry32(Math.floor(Math.random() * 2 ** 31));
  const fresh = LOCATIONS.filter((l) => !excludeIds.includes(l.id));
  const pool = fresh.length >= ROUNDS_PER_GAME ? fresh : LOCATIONS;
  return shuffled(pool, rng);
}
