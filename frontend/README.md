# Qaida — frontend

The Next.js 16 (App Router) frontend for **Qaida**, a GeoGuessr-style
geography game about Kazakhstan. Game logic runs client-side and stats live in
`localStorage` — no general backend. The only server piece is the multiplayer
relay (`party/server.ts`, a partyserver Worker on Cloudflare; see Multiplayer
below).

Full project docs live at the repo root: [README](../README.md) ·
[PROJECT.md](../PROJECT.md) · [DESIGN.md](../DESIGN.md). Conventions for agents
live in [CLAUDE.md](CLAUDE.md).

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
node scripts/test-room.mjs         # multiplayer relay smoke test (party:dev running)
node scripts/diagnose.mjs          # headless check of /play (server must be running)
node scripts/screenshot-home.mjs   # capture the landing page
```

## Multiplayer

The realtime relay is a separate Cloudflare Worker (`party/server.ts`, config in
`wrangler.jsonc`). It only mirrors the live roster — round selection stays
deterministic on the client, seeded by the room code.

```bash
npm run party:dev      # wrangler dev on :8787 (local rooms)
npx wrangler login     # one-time, then:
npm run party:deploy   # deploy the Worker → prints its host
```

Point the client at a deployed Worker with `NEXT_PUBLIC_PARTY_HOST`
(e.g. `qaida-party.<sub>.workers.dev`) in `.env.local` / Vercel env. Without it
the client defaults to `127.0.0.1:8787`, and if no host is reachable the game
still plays solo. See [CLAUDE.md](CLAUDE.md) for the full architecture.

## Layout

```
src/app/          routes: / (landing), /play, /leaderboard, /room/[code];
                  globals.css holds DESIGN.md tokens, Sky Gradient, glow +
                  guess-flash utilities
src/components/   GameView, GuessMap (MapLibre), StreetViewPane,
                  SatelliteSightPane, ShareButton, RoomJoin, RoomOverlay
src/data/         locations.ts — the location dataset
src/lib/          scoring, rounds (daily + room seed), storage hooks,
                  i18n + translations, multiplayer (host/identity/codes)
src/store/        gameStore (state machine) + roomStore (shared roster)
party/            partyserver Worker — the multiplayer relay
scripts/          image pipeline (resolve/download/localize/add), diagnostics
public/locations/ location photos (Wikimedia Commons)
```
