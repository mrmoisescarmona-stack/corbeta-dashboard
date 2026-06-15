## Goal
Map the dashboard structure to the official flow (DIAGRAMA GENERAL DEL SISTEMA — Gestión de Aprobaciones de Descuentos Puntuales), so every phase in the diagram has a clear home in the UI. Today's sidebar (`Mis aprobaciones`, `Solicitudes`, `Proveedores`, `Reportes`, `Auditoría`, `Notificaciones`, `Configuración`) only loosely covers Phases 1 and 3 and leaves Phases 2, 4, and 5 implicit.

## Gap analysis vs. the sitemap

| Phase | Sitemap pages | Current route | Status |
|---|---|---|---|
| 1 — Recepción e Identificación | Preordenes Recibidas, Detalle de Preorden, Clasificación de Líneas | `dashboard.requests`, `dashboard.requests.$id` | Partial — no "inbox" framing, no line-classification view |
| 2 — Notificación / Respuesta Proveedor | Portal del Proveedor, Trazabilidad de Notificaciones | `dashboard.providers` (generic), `dashboard.notifications` | Missing supplier portal + per-line tracking |
| 3 — Evaluación Aprobadores Internos | Solicitudes Asignadas, Evaluación, Mis Preordenes (Vendedor) | `dashboard.approvals` | Partial — no Vendedor view |
| 4 — Cierre y Notificación al Vendedor | Resultado Final, Notificación al Vendedor | — | Missing |
| 5 — Envío a PeopleSoft e Integraciones | Envío PeopleSoft, Condición de Pago, Clasificación Productos, Info Proveedores | — | Missing |
| Global | Panel General, Reportes, Gestión de Workflows | `dashboard.index`, `dashboard.reports`, `dashboard.settings`, `dashboard.audit` | OK |

## Proposed navigation (sidebar grouped by phase)

```text
GENERAL
  Panel General                 /dashboard
FASE 1 · Recepción
  Preordenes recibidas          /dashboard/preorders            (rename of /requests)
    └ Detalle                   /dashboard/preorders/$id
FASE 2 · Proveedor
  Portal del proveedor          /dashboard/supplier-portal
  Trazabilidad notificaciones   /dashboard/notifications        (existing, repurposed)
FASE 3 · Aprobadores
  Mis aprobaciones              /dashboard/approvals
  Vista vendedor                /dashboard/sales-rep
FASE 4 · Cierre
  Resultados finales            /dashboard/resolutions
FASE 5 · Integraciones
  Envío PeopleSoft              /dashboard/peoplesoft
  Catálogos (pago / productos / proveedores)  /dashboard/peoplesoft/lookups
ADMIN
  Reportes y trazabilidad       /dashboard/reports
  Workflows                     /dashboard/settings
  Auditoría                     /dashboard/audit
```

## Work plan
1. Rename `dashboard.requests*` to `dashboard.preorders*` and update the detail page to surface the "¿% asumido por proveedor > 0?" branch + line-classification block from Phase 1.
2. Add new routes:
   - `dashboard.supplier-portal.tsx` (Phase 2 supplier-facing simulation)
   - `dashboard.sales-rep.tsx` (Phase 3 Vendedor view)
   - `dashboard.resolutions.tsx` (Phase 4 final result + notification log)
   - `dashboard.peoplesoft.tsx` and `dashboard.peoplesoft.lookups.tsx` (Phase 5)
3. Rework `dashboard.providers.tsx` → either fold into Phase 5 supplier lookup or remove (kept as part of "Info de Proveedores").
4. Rebuild the sidebar in `dashboard.tsx` with the grouped sections above, including a small phase tag (badge) per item so users see how navigation maps to the diagram.
5. Update `dashboard.index` KPIs/quick links to point at the new phase-aligned routes.
6. Keep `dashboard.notifications` but reframe it as "Trazabilidad de notificaciones" (Phase 2 log).

## Out of scope
- No new backend tables or real integrations with PeopleSoft / CorbeMóvil (UI-only mapping, mock data).
- No auth/role logic changes — login + gateway stay as they are.

## Technical notes
- All new routes follow `createFileRoute("/dashboard/<segment>")` and reuse the `DashboardLayout` outlet.
- Sidebar groups implemented as plain section headers inside the existing `<aside>` (no component lib changes).
- Renaming `requests` → `preorders` updates: file names, route strings, sidebar entry, and any `Link to`/`navigate` calls (currently only used inside the requests pages and dashboard index).
