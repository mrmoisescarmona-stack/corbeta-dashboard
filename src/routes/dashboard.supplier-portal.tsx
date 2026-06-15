import { createFileRoute } from "@tanstack/react-router";
import { Mail, CheckCircle2, XCircle, Pencil, Paperclip, Building2, Clock, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard/supplier-portal")({
  head: () => ({ meta: [{ title: "Portal del proveedor · Corbeta" }] }),
  component: SupplierPortalPage,
});

const pending = [
  { id: "PR-2024-000245", client: "Distribuidora del Valle", line: "Castrol GTX 20W50", qty: 24, pct: 4, sla: "Vence en 6h" },
  { id: "PR-2024-000244", client: "Moto Repuestos Norte", line: "Filtro Mann W 712/75", qty: 60, pct: 12, sla: "Vence mañana" },
  { id: "PR-2024-000241", client: "Autopartes del Caribe", line: "Refrigerante Prestone", qty: 36, pct: 6, sla: "Vence en 2d" },
];

const tracking = [
  { provider: "Castrol", id: "PR-2024-000244", hours: 31, reminderAt: "Hace 6h", status: "Vencida" as const },
  { provider: "Shell", id: "PR-2024-000240", hours: 18, reminderAt: "Hace 2h", status: "En riesgo" as const },
  { provider: "Mobil", id: "PR-2024-000236", hours: 4, reminderAt: "—", status: "A tiempo" as const },
  { provider: "Total", id: "PR-2024-000233", hours: 28, reminderAt: "Hace 4h", status: "Vencida" as const },
];

function SupplierPortalPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground ring-1 ring-success/30">Fase 2 · Proveedor</span>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Portal del proveedor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Seguimiento de respuestas de proveedores y vista simulada del portal donde responden (Aprobar / Rechazar / Modificar %).
        </p>
      </div>

      {/* Admin tracker */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2.5 p-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning"><Clock className="h-4 w-4" /></div>
          <h3 className="text-base font-semibold">Seguimiento de respuestas</h3>
          <span className="ml-auto text-xs text-muted-foreground">Vista interna · admins / supervisores</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-5 py-3">Proveedor</th>
                <th className="font-medium px-3 py-3">Preorden</th>
                <th className="font-medium px-3 py-3">Espera</th>
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-3 py-3">Último recordatorio</th>
                <th className="font-medium px-5 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {tracking.map((t) => {
                const isOver = t.hours >= 24;
                const isRisk = t.hours >= 12 && !isOver;
                const txt = isOver ? "text-destructive" : isRisk ? "text-warning" : "text-[oklch(0.45_0.13_160)]";
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{t.provider}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{t.id}</td>
                    <td className={`px-3 py-3.5 font-semibold tabular-nums ${txt}`}>{t.hours}h {isOver && "⚠"}</td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          isOver
                            ? "bg-destructive/10 text-destructive"
                            : isRisk
                              ? "bg-warning/10 text-warning"
                              : "bg-success/15 text-foreground"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted-foreground">{t.reminderAt}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium hover:bg-accent">
                        <Bell className="h-3 w-3" /> Recordar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier session */}
      <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/15 text-foreground ring-1 ring-success/30">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">Castrol Colombia S.A.</div>
          <div className="text-xs text-muted-foreground">Sesión activa · contacto.castrol@corbeta.com.co</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning">
          <Clock className="h-3.5 w-3.5" /> 3 pendientes
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2.5 p-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Mail className="h-4 w-4" /></div>
          <h3 className="text-base font-semibold">Solicitudes pendientes de tu respuesta</h3>
        </div>
        <ul className="divide-y divide-border">
          {pending.map((p) => (
            <li key={p.id} className="p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{p.id} · {p.client}</div>
                  <div className="mt-0.5 font-medium">{p.line}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Cant. {p.qty} · % solicitado al proveedor: <span className="font-medium text-foreground">{p.pct}%</span></div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning">
                  <Clock className="h-3 w-3" /> {p.sla}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-medium ring-1 ring-success/30 hover:bg-success/25">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent">
                  <Pencil className="h-3.5 w-3.5" /> Modificar %
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/15">
                  <XCircle className="h-3.5 w-3.5" /> Rechazar
                </button>
                <button className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
                  <Paperclip className="h-3.5 w-3.5" /> Adjuntar soporte
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
