# Qaida

**How well do you know Kazakhstan?**

Qaida is a GeoGuessr-style geography game focused entirely on Kazakhstan. You see a street panorama, landmark, or landscape, pin where you think it is on the map, and score up to 5000 points based on how close you were.

This is the **frontend-only MVP** — all game logic runs in the browser, no backend required. See [PROJECT.md](PROJECT.md) for the full product vision and [DESIGN.md](DESIGN.md) for the design system.

## Features (MVP)

- **Quick Play** — 5 random rounds across all of Kazakhstan
- **Daily Challenge** — everyone gets the same 5 locations (seeded by date), one attempt per day
- **Infinite Mode** — endless rounds, chase your best streak
- **Landmark Mode** — only iconic, easy-to-recognize places
- **Expert Mode** — remote cities and hard-to-place spots
- **Scoring** — distance-based (max 5000/round) + speed bonus (+100…+500) + streak multiplier (up to ×2) + Perfect badge for guesses within 1 km
- **Rank titles** — end-of-game rank from *Tourist* to *Legend of the Steppe* based on average round score
- **Educational layer** — every round ends with a fact about the location
- **Share card** — copy/share your result as text
- **Local stats** — best score, streaks, and game history stored in `localStorage` (global leaderboards need accounts/backend — future phase)
- **GeoGuessr-style Street View** — with a Google Maps API key configured, rounds show an interactive 360° panorama (labels and addresses hidden); without a key (or where coverage is missing) the game falls back to photos
- 32 real locations across all regions, photos served locally (sourced from Wikimedia Commons)

## Design system

The UI implements [DESIGN.md](DESIGN.md) — adventurous, premium, cinematic; not a quiz app. Key pieces:

- **Palette** (CSS variables in `frontend/src/app/globals.css`, exposed as Tailwind tokens):
  - Steppe Black `#0B1118` — app background
  - Night Blue `#111C2C` — panels, cards, overlays (`bg-surface`)
  - Kazakhstan Turquoise `#00A6A6` — buttons, active states, guess pins (`bg-accent`)
  - Steppe Gold `#D6A84F` — scores, achievements, actual-location pins (`text-gold`)
  - Sand `#D9C7A3` — information blocks like location facts (`text-sand`)
  - Snow `#F5F7FA` / Fog `#9AA8B8` — primary / secondary text
- **Sky Gradient** (`.bg-sky-gradient`) — turquoise horizon glow fading into steppe night; used for atmosphere on summary/stats screens
- **Typography** — Space Grotesk (`font-display`) for the brand, headings, scores, and buttons; Geist for body text
- **Cinematic home screen** — full-bleed Charyn Canyon photo backdrop with gradient overlays
- **Glow utilities** — `.text-gold-glow` for score reveals, `.shadow-accent-glow` for primary CTAs

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Zustand (game state)
- MapLibre GL (map, OpenStreetMap raster tiles)
- Space Grotesk + Geist via `next/font`

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
DESIGN.md              # design system: vision, brand, palette, gradients
PROJECT.md             # product vision and roadmap
frontend/src/
  app/                 # routes: / (landing), /play, /leaderboard
    globals.css        # DESIGN.md tokens, Sky Gradient, glow utilities
  components/          # GameView, GuessMap (MapLibre), Street View panes, ShareButton
  data/locations.ts    # the location dataset (coords, facts, images)
  lib/                 # scoring, round selection / daily seed, storage
  store/gameStore.ts   # Zustand game state machine
frontend/scripts/      # image pipeline, diagnostics, screenshot helpers
frontend/public/locations/  # downloaded location photos
```

## Branches

- `main` — stable MVP
- `refactor-design` — DESIGN.md design-system implementation (palette tokens, Space Grotesk display font, cinematic home, Sky Gradient, rank titles, brand map pins)

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
