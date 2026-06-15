import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Pencil,
  Ban,
  Paperclip,
  Bell,
  Bookmark,
  Check,
} from "lucide-react";
import { RequestsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/preorders")({
  head: () => ({ meta: [{ title: "Solicitudes · Corbeta" }] }),
  component: RequestsPage,
  pendingComponent: RequestsSkeleton,
});

type Status =
  | "Pendiente"
  | "Espera proveedor"
  | "Aprobada"
  | "Rechazada"
  | "Modificada"
  | "Cancelada"
  | "Enviada a PeopleSoft"
  | "Error integración";

const ALL_STATUS: Status[] = [
  "Pendiente",
  "Espera proveedor",
  "Aprobada",
  "Rechazada",
  "Modificada",
  "Cancelada",
  "Enviada a PeopleSoft",
  "Error integración",
];

type Row = {
  id: string;
  client: string;
  zone: string;
  date: string;
  provider: string;
  status: Status;
  valueM: number;
  discountPct: number;
  linesTotal: number;
  linesApproved: number;
  deadlineHours: number; // hours from now (neg = overdue)
  approver: { name: string; initials: string };
};

const approvers = [
  { name: "Moises Carmona", initials: "MC" },
  { name: "Juan Pérez", initials: "JP" },
  { name: "María López", initials: "ML" },
  { name: "Ana Carolina", initials: "AC" },
];

const stats = [
  { label: "Total mes", value: 245, delta: "+18%" },
  { label: "Aprobadas", value: 168, delta: "68%" },
  { label: "Rechazadas", value: 32, delta: "13%" },
  { label: "En curso · $214M", value: 45, delta: "Valor en gestión" },
];

const rows: Row[] = Array.from({ length: 10 }).map((_, i) => {
  const status = ALL_STATUS[i % ALL_STATUS.length];
  const linesTotal = 3 + (i % 4);
  const linesApproved =
    status === "Aprobada" || status === "Enviada a PeopleSoft"
      ? linesTotal
      : Math.min(linesTotal, Math.max(0, i % linesTotal));
  return {
    id: `PR-2026-0002${30 + i}`,
    client: [
      "Distribuidora del Valle",
      "Moto Repuestos Norte",
      "Comercializadora Andina",
      "Lubricantes del Sur",
      "Autopartes del Caribe",
    ][i % 5],
    zone: ["Norte", "Centro", "Sur", "Occidente"][i % 4],
    date: `${20 + (i % 8)}/05/2026`,
    provider: "Castrol",
    status,
    valueM: +(1 + i * 0.8).toFixed(1),
    discountPct: 4 + (i % 9),
    linesTotal,
    linesApproved,
    deadlineHours: [-2, 4, 26, 72, -5, 8, 30, 12, 48, -1][i],
    approver: approvers[i % approvers.length],
  };
});

function statusClass(s: Status) {
  const map: Record<Status, string> = {
    Pendiente: "bg-primary/10 text-primary",
    "Espera proveedor": "bg-warning/10 text-warning",
    Aprobada: "bg-success/15 text-foreground ring-1 ring-success/30",
    Rechazada: "bg-destructive/10 text-destructive",
    Modificada: "bg-[oklch(0.94_0.04_300)] text-[oklch(0.4_0.18_300)]",
    Cancelada: "bg-muted text-muted-foreground",
    "Enviada a PeopleSoft": "bg-[oklch(0.95_0.04_240)] text-[oklch(0.42_0.15_240)]",
    "Error integración": "bg-[oklch(0.96_0.04_330)] text-[oklch(0.45_0.18_330)]",
  };
  return map[s];
}

function deadlineMeta(h: number) {
  if (h < 0) return { label: `Vencida ${Math.abs(h)}h`, dot: "bg-destructive", text: "text-destructive" };
  if (h <= 8) return { label: `Vence en ${h}h`, dot: "bg-destructive", text: "text-destructive" };
  if (h <= 48) return { label: `${h}h restantes`, dot: "bg-warning", text: "text-warning" };
  return { label: `${Math.round(h / 24)}d restantes`, dot: "bg-[oklch(0.6_0.15_160)]", text: "text-[oklch(0.45_0.13_160)]" };
}

function RequestsPage() {
  if (useFakeLoading()) return <RequestsSkeleton />;

  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "overdue" | "today" | "week">("all");
  const [approverFilter, setApproverFilter] = useState<string>("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeadlineMenu, setShowDeadlineMenu] = useState(false);
  const [showApproverMenu, setShowApproverMenu] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
  const [savedViews, setSavedViews] = useState<{ name: string }[]>([
    { name: "Mis pendientes urgentes" },
  ]);
  const [showSavedMenu, setShowSavedMenu] = useState(false);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter.length && !statusFilter.includes(r.status)) return false;
      if (approverFilter && r.approver.name !== approverFilter) return false;
      if (deadlineFilter === "overdue" && r.deadlineHours >= 0) return false;
      if (deadlineFilter === "today" && (r.deadlineHours < 0 || r.deadlineHours > 12)) return false;
      if (deadlineFilter === "week" && (r.deadlineHours < 0 || r.deadlineHours > 24 * 7)) return false;
      return true;
    });
  }, [statusFilter, deadlineFilter, approverFilter]);

  function toggleStatus(s: Status) {
    setStatusFilter((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Recepción</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Preórdenes recibidas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Inbox de preordenes con seguimiento a nivel de línea, vencimiento y aprobador asignado.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Nueva preorden
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

          {/* Estado multi-select */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusMenu((v) => !v); setShowDeadlineMenu(false); setShowApproverMenu(false); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Estado: {statusFilter.length === 0 ? "Todos" : `${statusFilter.length}`} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showStatusMenu && (
              <div className="absolute z-20 mt-1 w-56 rounded-lg border border-border bg-popover p-2 shadow-md">
                {ALL_STATUS.map((s) => {
                  const checked = statusFilter.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent"
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span>{s}</span>
                    </button>
                  );
                })}
                <button onClick={() => setStatusFilter([])} className="mt-1 w-full rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:bg-accent">Limpiar</button>
              </div>
            )}
          </div>

          {/* Vencimiento */}
          <div className="relative">
            <button
              onClick={() => { setShowDeadlineMenu((v) => !v); setShowStatusMenu(false); setShowApproverMenu(false); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Vencimiento: {{ all: "Todos", overdue: "Vencidas", today: "Hoy", week: "Esta semana" }[deadlineFilter]}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showDeadlineMenu && (
              <div className="absolute z-20 mt-1 w-48 rounded-lg border border-border bg-popover p-1 shadow-md">
                {(["all", "overdue", "today", "week"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDeadlineFilter(d); setShowDeadlineMenu(false); }}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent ${deadlineFilter === d ? "bg-accent" : ""}`}
                  >
                    {{ all: "Todos", overdue: "Vencidas", today: "Vencen hoy", week: "Esta semana" }[d]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Aprobador */}
          <div className="relative">
            <button
              onClick={() => { setShowApproverMenu((v) => !v); setShowStatusMenu(false); setShowDeadlineMenu(false); }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Aprobador: {approverFilter || "Todos"} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showApproverMenu && (
              <div className="absolute z-20 mt-1 w-52 rounded-lg border border-border bg-popover p-1 shadow-md">
                <button onClick={() => { setApproverFilter(""); setShowApproverMenu(false); }} className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent">Todos</button>
                {approvers.map((a) => (
                  <button key={a.name} onClick={() => { setApproverFilter(a.name); setShowApproverMenu(false); }} className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent">
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
            <Filter className="h-3.5 w-3.5" /> Más filtros
          </button>

          {/* Saved views */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowSavedMenu((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <Bookmark className="h-3.5 w-3.5" /> Mis vistas <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showSavedMenu && (
              <div className="absolute right-0 z-20 mt-1 w-60 rounded-lg border border-border bg-popover p-2 shadow-md">
                {savedViews.length === 0 && <div className="px-2 py-1.5 text-xs text-muted-foreground">Sin vistas guardadas</div>}
                {savedViews.map((v) => (
                  <button key={v.name} className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent">{v.name}</button>
                ))}
                <button
                  onClick={() => {
                    const n = prompt("Nombre de la vista");
                    if (n) setSavedViews((p) => [...p, { name: n }]);
                    setShowSavedMenu(false);
                  }}
                  className="mt-1 block w-full rounded-md border border-dashed border-border px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent"
                >
                  + Guardar filtros actuales
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-5 py-3">Preorden</th>
                <th className="font-medium px-3 py-3">Cliente</th>
                <th className="font-medium px-3 py-3">Líneas</th>
                <th className="font-medium px-3 py-3">Fecha límite</th>
                <th className="font-medium px-3 py-3">Aprobador</th>
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-3 py-3 text-right">Valor / Dto</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const d = deadlineMeta(r.deadlineHours);
                const progress = Math.round((r.linesApproved / r.linesTotal) * 100);
                const isLowValue = r.valueM < 3;
                return (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/40 align-top">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{r.id}</div>
                      <div className="text-[11px] text-muted-foreground">{r.date}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div>{r.client}</div>
                      <div className="text-[11px] text-muted-foreground">Zona {r.zone} · {r.provider}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="text-xs font-medium tabular-nums">{r.linesApproved}/{r.linesTotal} aprobadas</div>
                      <div className="mt-1 h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${progress}%` }} />
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${d.dot}`} />
                        <span className={`text-xs font-medium ${d.text}`}>{d.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {r.approver.initials}
                        </span>
                        <span className="text-xs">{r.approver.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="font-medium tabular-nums">${r.valueM.toFixed(1)}M</div>
                      <div className="text-[11px] text-muted-foreground">{r.discountPct}% dto</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {isLowValue && r.status === "Pendiente" && (
                          <button className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 text-[11px] font-medium ring-1 ring-success/30 hover:bg-success/25" title="Aprobar rápido">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                          </button>
                        )}
                        <Link to="/dashboard/preorders/$id" params={{ id: r.id }} className="rounded-md p-1.5 hover:bg-accent" aria-label="Ver detalle">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setOpenRowMenu((p) => (p === r.id ? null : r.id))}
                            className="rounded-md p-1.5 hover:bg-accent"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openRowMenu === r.id && (
                            <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-border bg-popover p-1 text-xs shadow-md">
                              <MenuItem icon={CheckCircle2} label="Aprobar" tone="success" />
                              <MenuItem icon={XCircle} label="Rechazar" tone="destructive" />
                              <MenuItem icon={Pencil} label="Modificar %" />
                              <MenuItem icon={Ban} label="Cancelar" />
                              <div className="my-1 h-px bg-border" />
                              <MenuItem icon={Eye} label="Ver detalle" />
                              <MenuItem icon={Paperclip} label="Ver soporte" />
                              <MenuItem icon={Bell} label="Recordar proveedor" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-5 border-t border-border">
          <span className="text-xs text-muted-foreground">Mostrando {filtered.length} de 245</span>
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

function MenuItem({ icon: Icon, label, tone }: { icon: any; label: string; tone?: "success" | "destructive" }) {
  const cls =
    tone === "success"
      ? "text-[oklch(0.45_0.13_160)]"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <button className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
