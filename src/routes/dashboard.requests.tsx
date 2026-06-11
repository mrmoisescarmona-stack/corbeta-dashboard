import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search, Filter, ChevronDown, Plus, Eye, MoreHorizontal } from "lucide-react";
import { RequestsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/requests")({
  head: () => ({ meta: [{ title: "Solicitudes · Corbeta" }] }),
  component: RequestsPage,
  pendingComponent: RequestsSkeleton,
});

const stats = [
  { label: "Total mes", value: 245, delta: "+18%" },
  { label: "Aprobadas", value: 168, delta: "68%" },
  { label: "Rechazadas", value: 32, delta: "13%" },
  { label: "En curso", value: 45, delta: "19%" },
];

const rows = Array.from({ length: 10 }).map((_, i) => ({
  id: `PR-2024-0002${30 + i}`,
  client: ["Distribuidora del Valle", "Moto Repuestos Norte", "Comercializadora Andina", "Lubricantes del Sur", "Autopartes del Caribe"][i % 5],
  zone: ["Norte", "Centro", "Sur", "Occidente"][i % 4],
  date: `${20 + (i % 8)}/05/2024`,
  provider: "Castrol",
  status: ["Pendiente", "Aprobada", "Espera proveedor", "Rechazada"][i % 4],
  value: `$ ${(1 + i * 0.8).toFixed(1)}M`,
}));

function RequestsPage() {
  if (useFakeLoading()) return <RequestsSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Solicitudes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Listado completo de solicitudes de descuento puntual.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Nueva solicitud
        </button>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl font-semibold tabular-nums">{s.value}</div>
              <span className="text-[11px] font-medium text-muted-foreground">{s.delta}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
            <h3 className="text-base font-semibold">Todas las solicitudes</h3>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">Exportar CSV</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Buscar…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
          </div>
          {["Estado: Todos", "Zona: Todas", "Proveedor: Todos", "Fecha: Este mes"].map((f) => (
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
                <th className="font-medium px-3 py-3">Zona</th>
                <th className="font-medium px-3 py-3">Fecha</th>
                <th className="font-medium px-3 py-3">Proveedor</th>
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-3 py-3 text-right">Valor</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-medium">{r.id}</td>
                  <td className="px-3 py-3.5">{r.client}</td>
                  <td className="px-3 py-3.5 text-muted-foreground">{r.zone}</td>
                  <td className="px-3 py-3.5 text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-3.5">{r.provider}</td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">{r.status}</span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{r.value}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-md p-1.5 hover:bg-accent"><Eye className="h-4 w-4" /></button>
                      <button className="rounded-md p-1.5 hover:bg-accent"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-5 border-t border-border">
          <span className="text-xs text-muted-foreground">Mostrando 1 a 10 de 245</span>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "3", "…", "25", "›"].map((p, i) => (
              <button key={i} className={`min-w-8 h-8 rounded-md border border-border px-2 text-xs ${p === "1" ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
