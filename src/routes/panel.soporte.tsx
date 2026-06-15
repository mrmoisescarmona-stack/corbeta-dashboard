import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Database, RotateCcw, Headphones } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/panel/soporte")({
  head: () => ({ meta: [{ title: "Soporte · Corbeta" }] }),
  component: SupportPage,
});

type Status = "Error" | "Aprobada";

const errors: { type: string; preorder: string; date: string; detail: string; status: Status }[] = [
  { type: "Recepción preorden", preorder: "PO-2026-004500", date: "9/06/2026, 8:15 a. m.", detail: "Preorden sin productos con descuento puntual. Estado asignado: Rechazado.", status: "Aprobada" },
  { type: "Envío PeopleSoft", preorder: "PO-2026-004498", date: "8/06/2026, 4:45 p. m.", detail: "Timeout en integración con PeopleSoft al enviar preorden gestionada.", status: "Error" },
  { type: "Notificación", preorder: "PO-2026-004495", date: "8/06/2026, 11:20 a. m.", detail: "Error SMTP al enviar notificación al proveedor Samsung Colombia S.A.", status: "Aprobada" },
  { type: "Condición de pago", preorder: "PO-2026-004490", date: "7/06/2026, 1:00 p. m.", detail: "Cliente no encontrado en PeopleSoft para consulta de condición de pago.", status: "Error" },
];

const stats = [
  { label: "Errores pendientes", value: "2", icon: AlertTriangle, tone: "warning" as const },
  { label: "Reprocesados", value: "2", icon: CheckCircle2, tone: "success" as const },
  { label: "Total registros", value: "4", icon: Database, tone: "primary" as const },
];

function SupportPage() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const filtered = errors.filter(
    (e) => (!type || e.type === type) && (!status || e.status === status),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Headphones className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Panel de Soporte</h2>
          <p className="mt-1 text-sm text-muted-foreground">Consulta y gestión de errores de integración.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const toneMap = {
            warning: "bg-warning/10 text-warning",
            success: "bg-success/15 text-success",
            primary: "bg-primary/10 text-primary",
          } as const;
          const valueTone = {
            warning: "text-foreground",
            success: "text-success",
            primary: "text-foreground",
          } as const;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneMap[s.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
              <div className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${valueTone[s.tone]}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Errores de integración</h3>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Tipo de error</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Seleccionar…</option>
              {[...new Set(errors.map((e) => e.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Seleccionar…</option>
              <option value="Error">Error</option>
              <option value="Aprobada">Aprobada</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-y border-border bg-muted/30">
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Preorden</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Detalle</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium tabular-nums">{e.preorder}</td>
                  <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{e.date}</td>
                  <td className="px-5 py-4 text-muted-foreground">{e.detail}</td>
                  <td className="px-5 py-4">
                    {e.status === "Error" ? (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive ring-1 ring-destructive/20">Error</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success ring-1 ring-success/30">Aprobada</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {e.status === "Error" && (
                      <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
                        <RotateCcw className="h-3.5 w-3.5" /> Reprocesar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay registros para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
