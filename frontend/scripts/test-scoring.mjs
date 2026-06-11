// Sanity tests for src/lib/scoring.ts (run: node scripts/test-scoring.mjs)
import assert from "node:assert/strict";
import {
  basePoints,
  haversineKm,
  scoreRound,
  speedBonus,
  streakMultiplier,
} from "../src/lib/scoring.ts";

// Haversine: Astana -> Almaty is ~970 km
const astanaAlmaty = haversineKm(51.1283, 71.4305, 43.222, 76.8512);
assert.ok(astanaAlmaty > 940 && astanaAlmaty < 1000, `got ${astanaAlmaty}`);

// Same point = 0 km, max points
assert.equal(Math.round(haversineKm(43.25, 76.95, 43.25, 76.95)), 0);
assert.equal(basePoints(0), 5000);
assert.equal(basePoints(1), 5000); // perfect threshold
assert.ok(basePoints(100) > basePoints(300)); // monotonic decay
assert.ok(basePoints(3000) >= 0 && basePoints(3000) < 300);

// Speed bonus: fast & close = +500, slow = 0, far = 0
assert.equal(speedBonus(10, 0), 500);
assert.ok(speedBonus(10, 15) >= 100 && speedBonus(10, 15) <= 500);
assert.equal(speedBonus(10, 30), 0);
assert.equal(speedBonus(200, 1), 0);

// Streak multiplier caps at 2
assert.equal(streakMultiplier(0), 1);
assert.equal(streakMultiplier(5), 1.5);
assert.equal(streakMultiplier(20), 2);

// Full round: perfect fast guess with a streak
const r = scoreRound(51.1283, 71.4305, 51.1283, 71.4305, 2, 3);
assert.ok(r.isPerfect && r.isClose);
assert.equal(r.base, 5000);
assert.ok(r.total > 5000); // bonus + multiplier applied
assert.ok(r.total <= (5000 + 500) * 2);

// Far guess: no bonus, no multiplier, streak-agnostic
const far = scoreRound(51.1283, 71.4305, 43.222, 76.8512, 2, 5);
assert.equal(far.bonus, 0);
assert.equal(far.multiplier, 1);
assert.ok(!far.isClose);

console.log("scoring: all assertions passed");
