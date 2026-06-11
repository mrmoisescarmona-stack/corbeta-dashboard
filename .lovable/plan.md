## Goal

Convert the current home page into a real dashboard area at `/dashboard` with a persistent sidebar, room for multiple sub-pages, and a fast shimmer skeleton while content mounts.

## Routing changes

Use TanStack's flat dot-naming so the sidebar stays mounted across sub-pages:

```
src/routes/
  index.tsx                 → redirects to /dashboard (or becomes a marketing landing later)
  dashboard.tsx             → layout: sidebar + topbar + <Outlet />
  dashboard.index.tsx       → /dashboard (current overview content)
  dashboard.approvals.tsx   → /dashboard/approvals (placeholder)
  dashboard.requests.tsx    → /dashboard/requests (placeholder)
  dashboard.reports.tsx     → /dashboard/reports (placeholder)
  dashboard.providers.tsx   → /dashboard/providers (placeholder)
  dashboard.settings.tsx    → /dashboard/settings (placeholder)
```

- Move the existing sidebar + header chrome from `index.tsx` into `dashboard.tsx` (the layout). It renders `<Outlet />` in the main area.
- Move the overview content (welcome, stat cards, requests table, donut, activity, zones) into `dashboard.index.tsx`.
- Convert sidebar `navItems` from `<button>` to `<Link to="/dashboard/...">` using `useRouterState` to compute the active item (replacing the hard-coded `active: true`).
- Each sub-page gets its own `head()` with route-specific title/description.
- `index.tsx` becomes a simple redirect to `/dashboard` (via `beforeLoad: () => redirect({ to: '/dashboard' })`).

## Skeleton + shimmer

Add a reusable shimmer skeleton primitive and use it in the overview page during a short initial mount.

1. **Shimmer utility** in `src/styles.css`: add a `@keyframes shimmer` (translateX -100% → 100%, ~1.2s linear infinite) and a `.shimmer` class that overlays a gradient `linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 8%, transparent), transparent)` on a muted base. Respects `prefers-reduced-motion`.
2. **Skeleton component**: extend the existing `src/components/ui/skeleton.tsx` (or wrap it) so it uses the shimmer overlay instead of `animate-pulse`. Keep the same API so other code keeps working.
3. **Page-level loaders** in `dashboard.index.tsx`:
   - `StatsSkeleton` — 5 stat-card placeholders matching the grid.
   - `TableSkeleton` — header row + 5 body rows of shimmering bars.
   - `DonutSkeleton` — circular shimmer + 5 legend rows.
   - `ActivitySkeleton` — 4 rows with icon + two lines.
4. **Trigger**: simple `useState(true)` + `useEffect` `setTimeout(..., 350ms)` so the shimmer flashes briefly on mount (quick, as requested). Structured so we can later swap in real loader/query state without changing layout.
5. **Route-level fallback**: add `pendingComponent` to each dashboard sub-route returning a minimal full-page skeleton, so navigation between sub-pages also shows the shimmer instantly.

## Visual details

- Skeleton bars use `rounded-md bg-muted/60` with the shimmer overlay.
- Heights/widths mirror the real elements (e.g. 32px for stat numbers, 14px for labels) so there's no layout shift when content swaps in.
- Sidebar links highlight the active route with the existing `bg-sidebar-accent` styling.

## Out of scope

- No backend data fetching yet — sub-pages are placeholder shells ("Coming soon" + skeleton preview).
- No auth gating on `/dashboard` (can add `_authenticated` layout later).
- No changes to login flow.
