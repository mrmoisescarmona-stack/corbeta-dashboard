## Hidden Style Guide Page

Create a secret, unlinked route at `/styleguide` documenting the entire design system. Not added to any nav, sidebar, or RBAC — accessible only by typing the URL.

### Route
- New file `src/routes/styleguide.tsx` → URL `/styleguide`
- Standalone page (outside the `/panel` shell) with its own minimal header and sticky table of contents
- `head()` sets `noindex, nofollow`
- Local dark-mode toggle (adds/removes `dark` on `document.documentElement`) so every section can be inspected in both themes

### Sections

1. **Brand & identity** — logo lockup, brand colors (Corbeta blue #0A157A, orange #F57C00, teal #4CCFC1) with hex + oklch.
2. **Color tokens** — every semantic CSS variable from `src/styles.css` (background, foreground, primary, secondary, muted, accent, success, warning, destructive, border, input, ring, sidebar.*) as swatches with token name, Tailwind class, resolved oklch value (read via `getComputedStyle`), and light/dark side-by-side.
3. **Typography** — Inter family, full scale `text-xs`→`text-4xl` with px/rem, weights 400/500/600/700, line-height, sample H1–H6, body, small, muted, link.
4. **Spacing scale** — visual bars for 0, 1, 2, 3, 4, 6, 8, 12, 16, 24.
5. **Border radius** — `--radius-sm/md/lg/xl` swatches with computed values.
6. **Shadows** — `shadow-sm/md/lg/xl/2xl` boxes.
7. **Hierarchy / page layout** — mock of page title + subtitle + section + card matching the Soporte / Notificaciones / Auditoría pattern.
8. **Buttons — every variant × size × state**
   - Variants: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive` (+ any custom variants in `src/components/ui/button.tsx`)
   - Sizes: `sm`, `default`, `lg`, `icon`
   - States rendered explicitly side-by-side for each variant:
     - Default
     - Hover (force with `:hover` demo + a row using `data-state` / class `hover` simulated by a wrapper that applies hover styles inline so the user sees it without mousing over)
     - Focus-visible (rendered with a helper that auto-focuses on mount of a sample)
     - Active/pressed
     - Disabled
     - Loading (spinner + disabled)
     - With leading icon, trailing icon, icon-only
   - Note: real hover/focus states are also live so the user can interact; the "forced" row is a static visual reference.
9. **Form controls — every state**
   - Input, Textarea, Select: default, hover, focus, filled, disabled, readonly, error (with helper text), success
   - Checkbox, Switch, RadioGroup: unchecked, checked, indeterminate (checkbox), disabled, focus
   - Slider: default, disabled, with value label
   - Label + helper text + error text examples
10. **Badges & status chips** — `default`, `secondary`, `outline`, `destructive`, plus app status chips (pendiente, aprobado, rechazado, vencido, en revisión).
11. **Navigation components** — Tabs (default/active/hover/disabled), Accordion (open/closed/hover), Breadcrumbs, Pagination, DropdownMenu (open state shown).
12. **Overlays** — Dialog, Sheet, Popover, Tooltip, AlertDialog — each with a trigger button plus a static "opened" preview alongside so the visual is always visible.
13. **Feedback** — Alert (all variants), Toast/Sonner (trigger buttons for success/error/warning/info), Progress, Skeleton.
14. **Data display** — Card (default/hover/selected), Table (header/row/hover/selected/striped), Avatar (sizes + fallback), Separator.
15. **Icons** — sample of lucide-react icons used across the app at 16 / 20 / 24 px, with names.
16. **Links** — default, hover, visited, focus, disabled.
17. **Motion / transitions** — list of durations and easings used (e.g. `transition-colors`, `duration-200`), with a hover demo card.

### Technical details
- `createFileRoute("/styleguide")` with `component: StyleGuidePage`
- Pure presentational page: no data fetching, no auth, no server functions
- CSS variable values resolved at runtime via `getComputedStyle(document.documentElement).getPropertyValue('--token')`
- For "forced state" rows: wrap a Button clone in a div with classes that mimic the hover/focus/active styles (e.g. apply the same Tailwind classes the variant applies on `:hover`) so the state is visible without interaction. Real interactive copies sit next to it.
- Page is responsive: TOC collapses on mobile

### Files
- **New:** `src/routes/styleguide.tsx`
- No other files modified. `routeTree.gen.ts` regenerates automatically.
