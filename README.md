# Qaida

**How well do you know Kazakhstan?**

Qaida is a GeoGuessr-style geography game focused entirely on Kazakhstan. You see a street panorama, landmark, or landscape, pin where you think it is on the map, and score up to 5000 points based on how close you were.

All game logic runs in the browser with `localStorage` persistence — no general backend. The one exception is **Play with friends** multiplayer, which uses a thin realtime relay (a [partyserver](https://github.com/cloudflare/partykit) Worker on Cloudflare Workers + Durable Objects) purely to mirror live scores between players. See [PROJECT.md](PROJECT.md) for the full product vision and [DESIGN.md](DESIGN.md) for the design system.

## Features

- **Quick Play** — 5 random rounds across all of Kazakhstan
- **Daily Challenge** — everyone gets the same 5 locations (seeded by date), one attempt per day
- **Play with friends** — real-time rooms: share an invite link, everyone gets the **same 5 places** (seeded by the room code), and you see each other's stage and score update live as an async race. Rows flash when someone lands a guess; the summary shows medal standings and competitive share text ("I beat X by N points")
- **Infinite Mode** — endless rounds, chase your best streak
- **Landmark Mode** — only iconic, easy-to-recognize places
- **Expert Mode** — remote cities and hard-to-place spots
- **Scoring** — distance-based (max 5000/round) + speed bonus (+100…+500) + streak multiplier (up to ×2) + Perfect badge for guesses within 1 km
- **Rank titles** — end-of-game rank from *Tourist* to *Legend of the Steppe* based on average round score
- **Trilingual** — Kazakh (Cyrillic, primary), English, and Russian, switchable in-app
- **Educational layer** — every round ends with a fact about the location
- **Share card** — copy/share your result as text (or social links)
- **Local stats** — best score, streaks, and game history stored in `localStorage` (global leaderboards need accounts — future phase)
- **GeoGuessr-style Street View** — with a Google Maps API key configured, rounds show an interactive 360° panorama (labels and addresses hidden); without a key (or where coverage is missing) the game falls back to photos
- 52 real locations across all regions, photos served locally (sourced from Wikimedia Commons)

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
- Zustand (game + room state)
- MapLibre GL (map, OpenStreetMap raster tiles)
- Space Grotesk + Geist via `next/font`
- Multiplayer: partyserver on Cloudflare Workers + Durable Objects; `partysocket` client. Deployed separately from the Vercel frontend

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

### Multiplayer ("Play with friends")

The realtime relay is a separate Cloudflare Worker (`frontend/party/server.ts`,
config in `frontend/wrangler.jsonc`). It only mirrors the live roster; round
selection stays deterministic on the client (seeded by the room code).

```bash
cd frontend
npm run party:dev                 # wrangler dev on :8787 (local rooms)
node scripts/test-room.mjs        # relay smoke test (PARTY_HOST=<host> for prod)
```

Deploy (needs a Cloudflare account):

```bash
npx wrangler login                # first deploy also needs a workers.dev
                                  # subdomain — open Workers once in the dashboard
npm run party:deploy              # prints qaida-party.<subdomain>.workers.dev
```

Then set `NEXT_PUBLIC_PARTY_HOST` to that host in the Vercel project env and
redeploy the frontend. Without it the game still runs — "Play with friends"
just falls back to solo play with a shareable link.

## Project structure

```
DESIGN.md              # design system: vision, brand, palette, gradients
PROJECT.md             # product vision and roadmap
frontend/src/
  app/                 # routes: / (landing), /play, /leaderboard, /room/[code]
    globals.css        # DESIGN.md tokens, Sky Gradient, glow + guess-flash utilities
  components/          # GameView, GuessMap (MapLibre), Street View panes,
                       # ShareButton, RoomJoin, RoomOverlay
  data/locations.ts    # the location dataset (coords, facts, images)
  lib/                 # scoring, round selection / daily + room seed, storage,
                       # i18n + translations, multiplayer (host/identity/codes)
  store/               # gameStore (state machine) + roomStore (shared roster)
frontend/party/        # partyserver Worker (multiplayer relay) + wrangler.jsonc
frontend/scripts/      # image pipeline, diagnostics, screenshot, room test
frontend/public/locations/  # downloaded location photos
```

## Branches

- `main` — current build (design system, trilingual i18n, multiplayer all merged)

## Adding locations

1. Add an entry to `frontend/src/data/locations.ts` (id, name, coords, region, category, difficulty 1–3, fact).
2. Put a photo at `frontend/public/locations/<id>.jpg`, or use the image pipeline: `scripts/resolve-images.mjs` + `scripts/download-images.mjs` + `scripts/localize-images.mjs`. `scripts/add-locations.mjs` does all three in one pass (resolve from Wikipedia/Commons → download → inject), skipping any candidate whose image can't be fetched.

## Attribution

- Photos: [Wikimedia Commons](https://commons.wikimedia.org/) (various authors/licenses)
- Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

## Roadmap (from PROJECT.md)

- **Done:** core gameplay, daily challenge, local stats, design system, trilingual UI, and real-time **Play with friends** rooms (via a managed realtime relay rather than a full backend)
- **Next:** accounts + global/regional leaderboards, XP (needs a persistent backend)
- **Later:** mobile app, community maps
