import { createFileRoute } from "@tanstack/react-router";
import { Search, ChevronDown, Filter, Building2 } from "lucide-react";
import { ProvidersSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/providers")({
  head: () => ({ meta: [{ title: "Proveedores · Corbeta" }] }),
  component: ProvidersPage,
  pendingComponent: ProvidersSkeleton,
});

const providers = [
  { name: "Castrol", category: "Lubricantes", status: "Activo", requests: 124, approved: 68, avg: "18.7h" },
  { name: "Shell", category: "Lubricantes", status: "Activo", requests: 86, approved: 72, avg: "14.2h" },
  { name: "Mobil", category: "Lubricantes", status: "Activo", requests: 54, approved: 65, avg: "21.1h" },
  { name: "Total", category: "Lubricantes", status: "Pausado", requests: 32, approved: 58, avg: "26.4h" },
  { name: "Valvoline", category: "Lubricantes", status: "Activo", requests: 48, approved: 70, avg: "16.9h" },
  { name: "Repsol", category: "Lubricantes", status: "Activo", requests: 39, approved: 62, avg: "19.5h" },
];

function ProvidersPage() {
  if (useFakeLoading()) return <ProvidersSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Proveedores</h2>
          <p className="mt-1 text-sm text-muted-foreground">Catálogo y desempeño de proveedores.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Nuevo proveedor
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Buscar proveedor…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        {["Categoría: Todas", "Estado: Todos"].map((f) => (
          <button key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
            {f} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        ))}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
          <Filter className="h-3.5 w-3.5" /> Filtros
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {providers.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category}</div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${p.status === "Activo" ? "bg-success/15 text-foreground ring-1 ring-success/30" : "bg-muted text-muted-foreground"}`}>
                {p.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] text-muted-foreground">Solicitudes</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{p.requests}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Aprob. %</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{p.approved}%</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Tiempo</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{p.avg}</div>
              </div>
            </div>
            <button className="w-full rounded-lg border border-border bg-background py-2 text-sm font-medium hover:bg-accent">
              Ver detalle
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
