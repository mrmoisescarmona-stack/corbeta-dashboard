## Goal

Refine the right-side brand panel on `/login` with a more polished abstract visual, keeping the rest of the page intact.

## Changes (scoped to `src/routes/login.tsx` + `src/styles.css`)

**Abstract element in the blue panel:**

- Add a layered abstract composition in the upper/center area of the right panel:
  - A large soft orb (radial gradient using `--success` teal) bleeding from top-right.
  - A second smaller orb (warm `--warning` orange) bleeding from bottom-left for color tension.
  - A subtle dotted/grid SVG overlay at ~8% opacity for texture (pure inline SVG, no asset).
  - A thin animated conic-gradient ring (CSS only, slow rotate) behind the headline as a "hero" focal element — evokes a shield/loop motif fitting an approvals portal.
  - Soft noise via `bg-[radial-gradient]` layered with `mix-blend-overlay` for premium depth.

**Refinements:**

- Tighten typography: slightly larger headline (`text-[44px] leading-[1.05]`), add a thin uppercase eyebrow above it.
- Replace the 3 stat cards with a single elegant glass card showing one hero metric ("98% SLA cumplido") + 2 tiny inline stats — cleaner, less competing with the abstract art.
- Add a subtle `motion-safe:animate-[float_8s_ease-in-out_infinite]` on one orb for life.

**Out of scope:** left form column, auth logic, colors tokens, routing.

## Technical

- New `@keyframes float` and `@keyframes spin-slow` in `src/styles.css`.
- All visuals are CSS/SVG inline — no new image assets, no new dependencies.