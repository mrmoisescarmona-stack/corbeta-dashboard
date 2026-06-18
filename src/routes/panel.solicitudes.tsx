import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  ChevronDown,
  Filter,
  Eye,
  MoreHorizontal,
  X,
} from "lucide-react";
import { PreordenDetail } from "@/components/preorden-detail";

export const Route = createFileRoute("/panel/solicitudes")({
  head: () => ({
    meta: [
      { title: "Solicitudes · Corbeta" },
      { name: "description", content: "Todas las solicitudes de descuento del sistema." },
    ],
  }),
  component: SolicitudesPage,
});

type Status =
  | "Pendiente"
  | "Espera proveedor"
  | "Aprobada"
  | "Rechazada"
  | "Modificada"
  | "Enviada a PeopleSoft"
  | "Error integración";

type Request = {
  id: string;
  client: string;
  date: string;
  provider: string;
  status: Status;
  value: string;
};

const requests: Request[] = [
  { id: "PR-2026-000245", client: "Distribuidora del Valle S.A.S.", date: "28/05/2026 09:15 a. m.", provider: "Castrol", status: "Pendiente", value: "$ 12.450.000" },
  { id: "PR-2026-000244", client: "Moto Repuestos del Norte", date: "28/05/2026 08:47 a. m.", provider: "Castrol", status: "Espera proveedor", value: "$ 8.230.000" },
  { id: "PR-2026-000243", client: "Comercializadora Andina", date: "28/05/2026 07:38 a. m.", provider: "Castrol", status: "Enviada a PeopleSoft", value: "$ 5.980.000" },
  { id: "PR-2026-000242", client: "Lubricantes del Sur Ltda.", date: "27/05/2026 04:22 p. m.", provider: "Shell", status: "Modificada", value: "$ 3.120.000" },
  { id: "PR-2026-000241", client: "Autopartes del Caribe", date: "27/05/2026 02:11 p. m.", provider: "Castrol", status: "Error integración", value: "$ 9.760.000" },
  { id: "PR-2026-000240", client: "Importadora Pacífico", date: "27/05/2026 11:05 a. m.", provider: "Mobil", status: "Aprobada", value: "$ 6.540.000" },
  { id: "PR-2026-000239", client: "Repuestos Bogotá Ltda.", date: "27/05/2026 09:48 a. m.", provider: "Shell", status: "Pendiente", value: "$ 4.310.000" },
  { id: "PR-2026-000238", client: "Lubricantes Sur", date: "26/05/2026 05:32 p. m.", provider: "Castrol", status: "Rechazada", value: "$ 2.880.000" },
  { id: "PR-2026-000237", client: "Distribuciones Caribe S.A.", date: "26/05/2026 03:20 p. m.", provider: "Mobil", status: "Aprobada", value: "$ 14.200.000" },
  { id: "PR-2026-000236", client: "AutoMundo S.A.S.", date: "26/05/2026 01:14 p. m.", provider: "Shell", status: "Enviada a PeopleSoft", value: "$ 7.650.000" },
  { id: "PR-2026-000235", client: "Moto Repuestos", date: "26/05/2026 10:47 a. m.", provider: "AKT", status: "Espera proveedor", value: "$ 1.925.000" },
  { id: "PR-2026-000234", client: "Comercial Andes Ltda.", date: "26/05/2026 09:02 a. m.", provider: "Castrol", status: "Aprobada", value: "$ 5.470.000" },
  { id: "PR-2026-000233", client: "Surtilubricantes S.A.", date: "25/05/2026 04:56 p. m.", provider: "Mobil", status: "Modificada", value: "$ 3.980.000" },
  { id: "PR-2026-000232", client: "Repuestos del Llano", date: "25/05/2026 02:38 p. m.", provider: "Shell", status: "Pendiente", value: "$ 2.110.000" },
  { id: "PR-2026-000231", client: "Distribuidora Tolima", date: "25/05/2026 11:24 a. m.", provider: "Castrol", status: "Aprobada", value: "$ 8.890.000" },
  { id: "PR-2026-000230", client: "AutoPartes Cauca", date: "25/05/2026 09:15 a. m.", provider: "Mobil", status: "Error integración", value: "$ 4.560.000" },
  { id: "PR-2026-000229", client: "Lubricentro Eje Cafetero", date: "24/05/2026 05:48 p. m.", provider: "Shell", status: "Enviada a PeopleSoft", value: "$ 11.320.000" },
  { id: "PR-2026-000228", client: "Repuestos La 80", date: "24/05/2026 03:11 p. m.", provider: "Castrol", status: "Aprobada", value: "$ 6.070.000" },
  { id: "PR-2026-000227", client: "Distribuidora Santander", date: "24/05/2026 12:34 p. m.", provider: "AKT", status: "Rechazada", value: "$ 1.480.000" },
  { id: "PR-2026-000226", client: "Importaciones del Sur", date: "24/05/2026 10:05 a. m.", provider: "Mobil", status: "Pendiente", value: "$ 9.240.000" },
];

const STATUSES: ("Todos" | Status)[] = [
  "Todos", "Pendiente", "Espera proveedor", "Aprobada", "Rechazada", "Modificada", "Enviada a PeopleSoft", "Error integración",
];

function statusBadge(status: Status) {
  const map: Record<Status, string> = {
    Pendiente: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
    "Espera proveedor": "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    Aprobada: "bg-success/15 text-foreground ring-1 ring-inset ring-success/30",
    Rechazada: "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20",
    Modificada: "bg-[oklch(0.94_0.04_300)] text-[oklch(0.4_0.18_300)] ring-1 ring-inset ring-[oklch(0.4_0.18_300)]/20",
    "Enviada a PeopleSoft": "bg-[oklch(0.95_0.04_240)] text-[oklch(0.42_0.15_240)] ring-1 ring-inset ring-[oklch(0.42_0.15_240)]/20",
    "Error integración": "bg-[oklch(0.96_0.04_330)] text-[oklch(0.45_0.18_330)] ring-1 ring-inset ring-[oklch(0.45_0.18_330)]/20",
  };
  return map[status];
}

function statusBar(status: Status) {
  const map: Record<Status, string> = {
    Pendiente: "bg-primary",
    "Espera proveedor": "bg-warning",
    Aprobada: "bg-success",
    Rechazada: "bg-destructive",
    Modificada: "bg-[oklch(0.55_0.18_300)]",
    "Enviada a PeopleSoft": "bg-[oklch(0.55_0.15_240)]",
    "Error integración": "bg-[oklch(0.55_0.18_330)]",
  };
  return map[status];
}

function SolicitudesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | Status>("Todos");
  const [statusOpen, setStatusOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState<{ id: string; status: Status } | null>(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "Todos" && r.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Solicitudes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Todas las solicitudes de descuento del sistema.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} de {requests.length} solicitudes
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2.5 p-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold">Listado de solicitudes</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar preorden, cliente o proveedor…"
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Estado: {statusFilter}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {statusOpen && (
              <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-border bg-popover shadow-md">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setStatusOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-accent ${statusFilter === s ? "font-semibold text-primary" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          {["Zona: Todas", "Proveedor: Todos"].map((f) => (
            <button key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
              {f}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
            <Filter className="h-3.5 w-3.5" />
            Filtros
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
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-3 py-3 text-right">Valor</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={(e) => {
                    const tgt = e.target as HTMLElement;
                    if (tgt.closest("a,button")) return;
                    window.location.href = `/panel/preordenes/${r.id}?from=solicitudes&status=${encodeURIComponent(r.status)}`;
                  }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`h-8 w-1 rounded-full ${statusBar(r.status)}`} />
                      <Link
                        to="/panel/preordenes/$id"
                        params={{ id: r.id }}
                        search={{ from: "solicitudes", status: r.status }}
                        className="font-medium text-foreground hover:underline"
                      >
                        {r.id}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-foreground/90">{r.client}</td>
                  <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{r.date}</td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      {r.provider}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{r.value}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/panel/preordenes/$id"
                        params={{ id: r.id }}
                        search={{ from: "solicitudes", status: r.status }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No hay solicitudes que coincidan con los filtros.
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
