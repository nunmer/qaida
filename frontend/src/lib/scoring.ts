/**
 * Scoring rules (PROJECT.md):
 * - Max 5000 points per round, decaying with distance.
 * - Speed bonus +100..+500 for fast answers (only when the guess is close).
 * - Streak multiplier for consecutive close guesses.
 * - Perfect guess: within 1 km.
 */

export const MAX_ROUND_SCORE = 5000;
export const PERFECT_DISTANCE_KM = 1;
export const CLOSE_GUESS_KM = 50; // counts toward streaks and speed bonus
const DECAY_KM = 300; // e-folding distance of the score curve

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function basePoints(distanceKm: number): number {
  if (distanceKm <= PERFECT_DISTANCE_KM) return MAX_ROUND_SCORE;
  return Math.round(MAX_ROUND_SCORE * Math.exp(-distanceKm / DECAY_KM));
}

/** +500 for an instant close answer, fading to +100 at 30s, 0 after. */
export function speedBonus(distanceKm: number, secondsTaken: number): number {
  if (distanceKm > CLOSE_GUESS_KM) return 0;
  if (secondsTaken >= 30) return 0;
  const bonus = 500 - Math.floor((secondsTaken / 30) * 400);
  return Math.max(100, Math.min(500, bonus));
}

/** Streak multiplier: x1.0, x1.1, x1.2 ... capped at x2.0. */
export function streakMultiplier(streak: number): number {
  return Math.min(2, 1 + Math.max(0, streak) * 0.1);
}

export interface RoundScore {
  distanceKm: number;
  base: number;
  bonus: number;
  multiplier: number;
  total: number;
  isPerfect: boolean;
  isClose: boolean;
}

export function scoreRound(
  guessLat: number,
  guessLng: number,
  actualLat: number,
  actualLng: number,
  secondsTaken: number,
  currentStreak: number,
): RoundScore {
  const distanceKm = haversineKm(guessLat, guessLng, actualLat, actualLng);
  const base = basePoints(distanceKm);
  const bonus = speedBonus(distanceKm, secondsTaken);
  const isClose = distanceKm <= CLOSE_GUESS_KM;
  const multiplier = isClose ? streakMultiplier(currentStreak) : 1;
  return {
    distanceKm,
    base,
    bonus,
    multiplier,
    total: Math.round((base + bonus) * multiplier),
    isPerfect: distanceKm <= PERFECT_DISTANCE_KM,
    isClose,
  };
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
