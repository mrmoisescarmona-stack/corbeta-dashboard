import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Database, CheckCircle2, RefreshCw, XCircle, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/peoplesoft")({
  head: () => ({ meta: [{ title: "PeopleSoft · Corbeta" }] }),
  component: PeopleSoftPage,
});

type DispatchStatus = "Enviada" | "Reintentando" | "Error";

const dispatches: { id: string; status: DispatchStatus; at: string; attempts: number; error?: string }[] = [
  { id: "PR-2026-000243", status: "Enviada", at: "28/05/2026 11:05", attempts: 1 },
  { id: "PR-2026-000241", status: "Enviada", at: "28/05/2026 10:51", attempts: 1 },
  { id: "PR-2026-000239", status: "Error", at: "28/05/2026 09:42", attempts: 3, error: "Producto no existe en catálogo PS (EAN 7702011009999)" },
  { id: "PR-2026-000238", status: "Reintentando", at: "28/05/2026 09:21", attempts: 2, error: "Timeout en endpoint /createOrder" },
  { id: "PR-2026-000236", status: "Error", at: "28/05/2026 08:55", attempts: 4, error: "NIT cliente sin registro en PeopleSoft" },
];

const kpis = [
  { label: "Enviadas OK (24h)", value: 87, icon: CheckCircle2, tone: "success" as const },
  { label: "Fallidas (24h)", value: 4, icon: XCircle, tone: "destructive" as const },
  { label: "En cola de reintento", value: 6, icon: Clock, tone: "warning" as const },
];

function PeopleSoftPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showRoot = pathname === "/dashboard/peoplesoft";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center rounded-full bg-[oklch(0.9_0.06_290)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.4_0.15_290)]">Integraciones</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Envío a PeopleSoft</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estado del despacho de preordenes gestionadas y catálogos consultados desde PeopleSoft.
          </p>
        </div>
        <nav className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-medium">
          <Link to="/dashboard/peoplesoft" className={`px-3 py-1.5 rounded-md ${showRoot ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
            Despachos
          </Link>
          <Link to="/dashboard/peoplesoft/lookups" className={`px-3 py-1.5 rounded-md ${!showRoot ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
            Catálogos
          </Link>
        </nav>
      </div>

      {showRoot ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              const tone = {
                success: "bg-success/15 text-foreground ring-success/30",
                destructive: "bg-destructive/10 text-destructive ring-destructive/20",
                warning: "bg-warning/10 text-warning ring-warning/20",
              }[k.tone];
              return (
                <div key={k.label} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{k.label}</div>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-3xl font-semibold tabular-nums">{k.value}</div>
                </div>
              );
            })}
          </section>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2.5 p-5 border-b border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Database className="h-4 w-4" /></div>
              <h3 className="text-base font-semibold">Cola de envío y reintentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="font-medium px-5 py-3">Preorden</th>
                    <th className="font-medium px-3 py-3">Estado</th>
                    <th className="font-medium px-3 py-3">Intentos</th>
                    <th className="font-medium px-3 py-3">Mensaje</th>
                    <th className="font-medium px-3 py-3">Última actividad</th>
                    <th className="font-medium px-5 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatches.map((d) => (
                    <tr key={d.id} className="border-t border-border hover:bg-muted/40 align-top">
                      <td className="px-5 py-3.5 font-medium">{d.id}</td>
                      <td className="px-3 py-3.5"><DispatchBadge status={d.status} /></td>
                      <td className="px-3 py-3.5 tabular-nums">{d.attempts}</td>
                      <td className="px-3 py-3.5 text-xs">
                        {d.error ? (
                          <span className="inline-flex items-start gap-1.5 text-destructive">
                            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {d.error}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{d.at}</td>
                      <td className="px-5 py-3.5 text-right">
                        {d.status !== "Enviada" ? (
                          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium hover:bg-accent">
                            <RefreshCw className="h-3 w-3" /> Reintentar
                          </button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

function DispatchBadge({ status }: { status: DispatchStatus }) {
  const map: Record<DispatchStatus, { tone: string; Icon: any }> = {
    "Enviada": { tone: "bg-success/15 text-foreground ring-success/30", Icon: CheckCircle2 },
    "Reintentando": { tone: "bg-warning/10 text-warning ring-warning/20", Icon: RefreshCw },
    "Error": { tone: "bg-destructive/10 text-destructive ring-destructive/20", Icon: XCircle },
  };
  const { tone, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${tone}`}>
      <Icon className="h-3 w-3" /> {status}
    </span>
  );
}
