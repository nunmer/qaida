# Qaida — frontend

The Next.js 16 (App Router) frontend for **Qaida**, a GeoGuessr-style
geography game about Kazakhstan. This is the whole MVP — game logic runs
client-side, stats live in `localStorage`, no backend.

Full project docs live at the repo root: [README](../README.md) ·
[PROJECT.md](../PROJECT.md) · [DESIGN.md](../DESIGN.md).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

Optional Street View panoramas — create `.env.local` (see
`.env.local.example`):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

Without a key the game falls back to local photos.

## Build & verify

```bash
npm run build                      # production build + type check
npm start                          # serve the build
node scripts/test-scoring.mjs      # scoring unit checks
node scripts/diagnose.mjs          # headless check of /play (server must be running)
node scripts/screenshot-home.mjs   # capture the landing page
```

## Layout

```
src/app/          routes: / (landing), /play, /leaderboard; globals.css holds
                  the DESIGN.md color tokens, Sky Gradient and glow utilities
src/components/   GameView, GuessMap (MapLibre), StreetViewPane,
                  SatelliteSightPane, ShareButton
src/data/         locations.ts — the location dataset
src/lib/          scoring, round selection / daily seed, storage hooks
src/store/        gameStore.ts — Zustand game state machine
scripts/          image pipeline (resolve/download/localize), diagnostics
public/locations/ location photos (Wikimedia Commons)
```
