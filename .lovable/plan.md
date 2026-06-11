## Goal

Refine the brand-panel slider on `/login` so the photos read more clearly, slides advance faster, and transitions feel more polished.

## Changes (scoped to `src/routes/login.tsx` + `src/styles.css`)

### 1. Increase image visibility

- Raise photo opacity from `0.35` → `0.65`.
- Lighten the blue tint overlay so the image shows through: drop from `linear-gradient(135deg, primary 70% → 55%)` to a softer `linear-gradient(160deg, primary 45% → primary 25%)` plus a bottom-anchored `linear-gradient(to top, primary 70%, transparent 60%)` so the text area at the bottom stays legible while the upper image area is bright.
- Add a subtle `saturate(1.1) contrast(1.05)` filter on the image layer for punch.

### 2. Faster cadence

- `SLIDE_DURATION`: `12000ms` → `7000ms` (full cycle ~21s across 3 slides).

### 3. Better animation

Replace the current crossfade + translateY with a more cinematic transition:

- **Image layer**: crossfade (1200ms ease) + slow Ken Burns zoom on the active slide — `transform: scale(1) → scale(1.08)` over the slide's full 7s lifetime via a new `@keyframes kenburns`. Inactive slides reset to `scale(1)`.
- **Text layer**: replace single-block fade with staggered child reveal — eyebrow, headline, body, stat card each animate in with `translateY(14px) → 0` + opacity `0 → 1`, delays `0 / 80 / 160 / 240ms`, duration 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Exiting slide fades out faster (300ms) with a small `translateY(-6px)`.
- **Progress bar**: keep linear fill, but soften height to `1.5px` and add a faint glow (`box-shadow: 0 0 8px white/40`) on the active fill so it reads as "live".
- Respect `prefers-reduced-motion` — disable ken-burns and stagger, keep only opacity crossfade.

### 4. Technical

- Add keyframes in `src/styles.css`: `kenburns`, `slide-reveal` (the staggered text in), and extend the existing reduced-motion block.
- In `login.tsx`, wrap each text element with a `slide-reveal` animation keyed on `index` so it re-runs on slide change, with inline `animationDelay`.

**Out of scope:** form column, copy, slide content, colors tokens.
