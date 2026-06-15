import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Search, Filter, ChevronDown, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, ListChecks } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/approvals")({
  head: () => ({ meta: [{ title: "Mis aprobaciones · Corbeta" }] }),
  component: ApprovalsPage,
  pendingComponent: ApprovalsSkeleton,
});

const stats = [
  { icon: ListChecks, label: "Asignadas a mí", value: 14, delta: "+2 hoy", tone: "bg-primary/10 text-primary" },
  { icon: Clock, label: "Vencen hoy", value: 3, delta: "Atención", tone: "bg-warning/10 text-warning" },
  { icon: CheckCircle2, label: "Aprobadas (semana)", value: 28, delta: "+12%", tone: "bg-success/20 text-foreground" },
  { icon: XCircle, label: "Rechazadas (semana)", value: 4, delta: "-1", tone: "bg-destructive/10 text-destructive" },
];

const rows = Array.from({ length: 8 }).map((_, i) => ({
  id: `PR-2026-0002${40 + i}`,
  client: ["Distribuidora del Valle", "Moto Repuestos Norte", "Comercializadora Andina", "Lubricantes del Sur", "Autopartes del Caribe"][i % 5],
  date: "28/05/2026",
  provider: "Castrol",
  status: ["Pendiente", "Espera proveedor", "Pendiente", "Aprobada"][i % 4],
  sla: ["2h", "vence hoy", "4h", "ok"][i % 4],
  value: `$ ${(2 + i).toFixed(1)}M`,
}));

function ApprovalsPage() {
  if (useFakeLoading()) return <ApprovalsSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Mis aprobaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Solicitudes asignadas a ti para revisión y aprobación.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Revisar siguiente
        </button>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}><Icon className="h-5 w-5" /></div>
                <span className="text-[11px] font-medium text-muted-foreground">{s.delta}</span>
              </div>
              <div className="mt-4 text-3xl font-semibold tabular-nums">{s.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </section>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><ClipboardList className="h-4 w-4" /></div>
            <h3 className="text-base font-semibold">Cola de aprobaciones</h3>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">Exportar</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Buscar…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
          </div>
          {["Estado: Pendiente", "Zona: Todas", "Proveedor: Todos"].map((f) => (
            <button key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
              {f} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
            <Filter className="h-3.5 w-3.5" /> Filtros
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-5 py-3">Preorden</th>
                <th className="font-medium px-3 py-3">Cliente</th>
                <th className="font-medium px-3 py-3">Fecha</th>
                <th className="font-medium px-3 py-3">Proveedor</th>
                <th className="font-medium px-3 py-3">SLA</th>
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-3 py-3 text-right">Valor</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-medium">{r.id}</td>
                  <td className="px-3 py-3.5 text-foreground/90">{r.client}</td>
                  <td className="px-3 py-3.5 text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-3.5">{r.provider}</td>
                  <td className="px-3 py-3.5 text-xs text-muted-foreground">{r.sla}</td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">{r.status}</span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{r.value}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Link to="/dashboard/preorders/$id" params={{ id: r.id }} className="rounded-md p-1.5 hover:bg-accent" aria-label="Ver detalle"><Eye className="h-4 w-4" /></Link>
                      <button className="rounded-md p-1.5 hover:bg-accent"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-5 border-t border-border">
          <span className="text-xs text-muted-foreground">Mostrando 1 a 8 de 14</span>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "›"].map((p, i) => (
              <button key={i} className={`min-w-8 h-8 rounded-md border border-border px-2 text-xs ${p === "1" ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
