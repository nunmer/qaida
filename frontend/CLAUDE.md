@AGENTS.md

# Qaida frontend — conventions

GeoGuessr-style geography game about Kazakhstan. Single-player is frontend-only:
all game logic runs client-side, persistence is `localStorage`. The one
exception is multiplayer "Play with friends" rooms, which use a thin PartyKit
relay (see Multiplayer below) — keep all *game* logic client-side regardless.

## Design system (../DESIGN.md)

All colors come from the tokens in `src/app/globals.css` — never hardcode hex
values in components (the only exception is MapLibre paint/marker options in
`GuessMap.tsx`, which can't use CSS variables):

| Token | Tailwind class | Use for |
|---|---|---|
| Steppe Black `#0B1118` | `bg-background` | app shell, game screens |
| Night Blue `#111C2C` | `bg-surface` (+ `bg-surface-2`) | panels, cards, overlays |
| Kazakhstan Turquoise `#00A6A6` | `bg-accent` / `text-accent-strong` | buttons, active states, guess pins |
| Steppe Gold `#D6A84F` | `text-gold` | scores, achievements, actual-location pins |
| Sand `#D9C7A3` | `text-sand` | information blocks (location facts), taglines |
| Snow `#F5F7FA` | `text-foreground` | primary text |
| Fog `#9AA8B8` | `text-muted` | secondary text |

Atmosphere helpers (defined in `globals.css`):

- `.bg-sky-gradient` — turquoise horizon glow into steppe night; apply only to
  full-width wrappers (it looks broken inside a centered max-width column)
- `.text-gold-glow` — score reveals and gold highlights
- `.shadow-accent-glow` — primary CTA buttons

Typography: `font-display` (Space Grotesk) for brand, headings, scores, and
button labels; default Geist for body text.

Tone (from DESIGN.md): adventurous, premium, playful, competitive. Avoid
generic dashboard aesthetics, template cards, and corporate SaaS looks.

## Architecture

- `src/app/` — routes: `/` (cinematic landing), `/play?mode=…`, `/leaderboard`
- `src/store/gameStore.ts` — Zustand state machine (`idle → guessing → result → finished`)
- `src/lib/` — pure logic: `scoring.ts`, `rounds.ts` (incl. daily seed), `storage.ts`
- `src/data/locations.ts` — location dataset; photos in `public/locations/<id>.jpg`
- `src/components/GuessMap.tsx` — MapLibre map. Gotcha: maplibre forces
  `position:relative` on its container, silently breaking Tailwind `absolute`;
  size it with `h-full`, not absolute positioning.
- Round imagery fallback chain: Street View 360° → label-free satellite → local photo
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` enables Street View; the game
  must remain fully playable without it

## Multiplayer ("Play with friends")

Real-time rooms where everyone gets the **same 5 places** and sees each other's
stage and score live. It's an *async race* — no lockstep; each player advances
at their own pace.

- `party/room.ts` — PartyKit server: a thin relay holding a roster of
  `{id, name, roundIndex, totalScore, status}`, rebroadcast on every
  join/progress/leave. No game data flows through it; scores are
  client-reported (fine for friends, not a ranked ladder).
- `src/lib/rounds.ts` `pickRoomRounds(code)` — the room code seeds the existing
  PRNG, so the invite link alone determines the 5 places (same trick as daily).
- `src/lib/multiplayer.ts` — host config, player identity, room-code helpers.
- `src/app/room/[code]/` → `RoomGame` → `RoomJoin` (lobby) then `GameView`
  with `roomCode` set, which renders `RoomOverlay` (live opponents panel).
- The invite link *is* the room: `/room/<CODE>`. Home page mints a code via
  `newRoomCode()`.
- Resilience: if the PartyKit host is unreachable the game still plays solo —
  the roster just stays empty.

**Local dev:** `npm run party:dev` (serves the room on :1999; client defaults
to `127.0.0.1:1999`). Smoke test the relay with `node scripts/test-room.mjs`.

**Deploy (manual, needs your account):**
1. `npx partykit login` (GitHub OAuth)
2. `npm run party:deploy` → prints the host, e.g. `qaida.<username>.partykit.dev`
3. Set `NEXT_PUBLIC_PARTYKIT_HOST` to that host in Vercel env, then redeploy.

## Verification

- `npm run build` must pass (TypeScript runs as part of it)
- `node scripts/screenshot-home.mjs` (dev/prod server on :3000) captures the
  home page; `scripts/diagnose.mjs` checks the play screen, console errors,
  and element geometry
