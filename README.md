# Qaida

**How well do you know Kazakhstan?**

Qaida is a GeoGuessr-style geography game focused entirely on Kazakhstan. You see a photo of a street, landmark, or landscape, pin where you think it is on the map, and score up to 5000 points based on how close you were.

This is the **frontend-only MVP** — all game logic runs in the browser, no backend required. See [PROJECT.md](PROJECT.md) for the full product vision.

## Features (MVP)

- **Quick Play** — 5 random rounds across all of Kazakhstan
- **Daily Challenge** — everyone gets the same 5 locations (seeded by date), one attempt per day
- **Infinite Mode** — endless rounds, chase your best streak
- **Landmark Mode** — only iconic, easy-to-recognize places
- **Expert Mode** — remote cities and hard-to-place spots
- **Scoring** — distance-based (max 5000/round) + speed bonus (+100…+500) + streak multiplier (up to ×2) + Perfect badge for guesses within 1 km
- **Educational layer** — every round ends with a fact about the location
- **Share card** — copy/share your result as text
- **Local stats** — best score, streaks, and game history stored in `localStorage` (global leaderboards need accounts/backend — future phase)
- **GeoGuessr-style Street View** — with a Google Maps API key configured, rounds show an interactive 360° panorama (labels and addresses hidden); without a key (or where coverage is missing) the game falls back to photos
- 32 real locations across all regions, photos served locally (sourced from Wikimedia Commons)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Zustand (game state)
- MapLibre GL (map, OpenStreetMap raster tiles)

## Run

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

### Street View (optional but recommended)

Create `frontend/.env.local` (see `.env.local.example`):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

The key needs the **Maps JavaScript API** enabled in Google Cloud Console. Street View usage through the JS API is billed per panorama load (free monthly credit applies). Restrict the key to your domain before deploying.

Production build:

```bash
npm run build
npm start
```

## Project structure

```
frontend/src/
  app/                 # routes: / (landing), /play, /leaderboard
  components/          # GameView, GuessMap (MapLibre), ShareButton
  data/locations.ts    # the location dataset (coords, facts, images)
  lib/                 # scoring, round selection / daily seed, storage
  store/gameStore.ts   # Zustand game state machine
frontend/scripts/      # one-off helpers to resolve & download images
frontend/public/locations/  # downloaded location photos
```

## Adding locations

1. Add an entry to `frontend/src/data/locations.ts` (id, name, coords, region, category, difficulty 1–3, fact).
2. Put a photo at `frontend/public/locations/<id>.jpg`, or use `scripts/resolve-images.mjs` + `scripts/download-images.mjs` to fetch one from Wikimedia Commons.

## Attribution

- Photos: [Wikimedia Commons](https://commons.wikimedia.org/) (various authors/licenses)
- Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

## Roadmap (from PROJECT.md)

- Phase 1 (this MVP): core gameplay, daily challenge, local stats
- Phase 2: backend (FastAPI/PostgreSQL), accounts, global & regional leaderboards, friend challenges, XP
- Phase 3: multiplayer, mobile app, community maps
