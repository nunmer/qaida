@AGENTS.md

# Qaida frontend — conventions

GeoGuessr-style geography game about Kazakhstan. Frontend-only MVP: all game
logic runs client-side, persistence is `localStorage`. Do not add a backend.

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

## Verification

- `npm run build` must pass (TypeScript runs as part of it)
- `node scripts/screenshot-home.mjs` (dev/prod server on :3000) captures the
  home page; `scripts/diagnose.mjs` checks the play screen, console errors,
  and element geometry
