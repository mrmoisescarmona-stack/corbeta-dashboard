# Apply SGA Dashboard Suggestions

Frontend-only changes (mock data, no backend). All updates apply the recommendations from the attached review.

## 1. Dashboard home (`dashboard.index.tsx`)

**KPI cards — rework**
- "Pendientes": add `⚠ N vencen hoy · M líneas` sub-line.
- "Espera proveedor": add `⚠ N sin respuesta >24h`.
- "Aprobadas hoy": append `· $XXX M` managed-value sub-line.
- New 4th KPI: `Tiempo prom. resolución` (e.g. `2.3 días`).

**New: Overdue queue banner** (above the table)
- Amber card "⏰ N solicitudes vencen hoy" listing top 3 with `Vence 5pm` / `Vence mañana` badges.

**Donut chart toggle**
- `# Solicitudes` / `$ Valor` segmented toggle; switches values + legend totals.

**Supplier wait time mini-card**
- Small table (Proveedor / Espera / Estado) with color-coded hours and `Vencida / En riesgo / A tiempo` badges.

## 2. Preorders list (`dashboard.preorders.tsx`)

**Columns**
- Add `Líneas` column (e.g. `3/5 aprobadas` with mini progress bar).
- Add `Fecha límite` with green/orange/red urgency dot.
- Change `Valor` → show `$12.4M · 8% dto`.
- Add `Aprobador` (avatar + name).

**Filters**
- Add `Vencimiento` filter (Vencidas / Vencen hoy / Esta semana / Todos).
- Add `Aprobador` filter.
- Convert `Estado` to multi-select.
- Add `Guardar vista` button (mocked: saves filter combo to local state, lists under a "Mis vistas" dropdown).

**Row actions menu (···)**
- Explicit items: Aprobar, Rechazar, Modificar %, Cancelar, Ver detalle, Ver soporte, Recordar proveedor.
- Inline quick-approve button on low-value rows.

**Status badges — add missing**
- `Modificada` (purple), `Enviada a PeopleSoft` (sky), `Error integración` (fuchsia).

## 3. Preorder detail (`dashboard.preorders.$id.tsx`)

Expand to the "core action screen":
- Header: preorder id, supplier, total value, discount %, deadline countdown.
- **Lines table**: every line with status, approver, support doc indicator (📎 required / uploaded), per-line approve/reject/modify actions.
- **Mandatory support doc enforcement**: disable submit until doc is attached; show inline warning.
- **Timeline panel** (right side): chronological events — Recibida → Notificada proveedor → Respuesta proveedor → Asignada aprobador → Decisión → Enviada PeopleSoft (with success/error states).

## 4. Supplier wait tracker (extend `dashboard.supplier-portal.tsx` admin view)

Add an admin-facing "Seguimiento de respuestas" table at the top: proveedor, preorden, horas en espera (color), último recordatorio, botón `Recordar`.

## 5. PeopleSoft integration status (`dashboard.peoplesoft.tsx`)

Add 3 KPI tiles (Enviadas OK / Fallidas / En cola) and a "Cola de reintentos" table with `Reintentar` action and error message column.

## 6. Audit / trazabilidad (`dashboard.audit.tsx`)

Add a per-preorden timeline view (same component used in preorder detail) reachable via a search box "Buscar preorden".

## 7. Sales rep view (`dashboard.sales-rep.tsx`)

Reframe as read-only status tracker: list of submitted preorders with current phase indicator (5-step progress bar) and result notification badge.

## 8. Sidebar nav (`dashboard.tsx`)

- Confirm Portal Proveedor and Vista Vendedor are present (already added previously) — relabel to match review: `Portal del Proveedor`, `Vista del Vendedor`.
- Add small `⚠` indicator next to "Mis aprobaciones" when overdue mock count > 0.

## Technical notes

- All changes are presentation-only; mock data stays inline in each route file.
- Reuse existing shadcn primitives (`Card`, `Badge`, `Table`, `Select`, `DropdownMenu`, `Progress`, `Tabs`).
- New shared component: `src/components/dashboard/PreorderTimeline.tsx` (used by detail + audit).
- New shared component: `src/components/dashboard/DeadlineBadge.tsx` for consistent urgency coloring.
- No route additions; no backend, auth, or schema changes.

## Out of scope (deferred)

- Reportes export, workflow config screen, approver-load panel, role impersonation — explicitly listed as low priority in the review.
