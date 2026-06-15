import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  BarChart3,
  Bell,
  Search,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Eye,
  MoreHorizontal,
  Filter,
  Plus,
  Upload,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Timer,
  Pencil,
  Ban,
  Check,
  X,
} from "lucide-react";
import { DashboardOverviewSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/panel/")({
  head: () => ({
    meta: [
      { title: "Panel · Corbeta" },
      {
        name: "description",
        content:
          "Resumen operativo de solicitudes, aprobaciones y tiempos de respuesta del equipo Corbeta.",
      },
    ],
  }),
  component: DashboardOverview,
  pendingComponent: DashboardOverviewSkeleton,
});

type Tone = "primary" | "warning" | "success" | "destructive" | "muted";

const stats: {
  label: string;
  value: string | number;
  icon: any;
  tone: Tone;
  delta: string;
  deltaTone?: "warn" | "muted" | "success";
}[] = [
  {
    label: "Pendientes de aprobar",
    value: 18,
    icon: ClipboardList,
    tone: "primary",
    delta: "⚠ 3 vencen hoy · 52 líneas",
    deltaTone: "warn",
  },
  {
    label: "En espera de proveedor",
    value: 7,
    icon: Clock,
    tone: "warning",
    delta: "⚠ 2 sin respuesta >24h",
    deltaTone: "warn",
  },
  {
    label: "Aprobadas hoy · $138M",
    value: 24,
    icon: CheckCircle2,
    tone: "success",
    delta: "Valor gestionado hoy",
    deltaTone: "success",
  },
  {
    label: "Tiempo prom. resolución",
    value: "2.3 d",
    icon: Timer,
    tone: "muted",
    delta: "-0.4 d vs sem. anterior",
    deltaTone: "success",
  },
];

type Status =
  | "Pendiente"
  | "Espera proveedor"
  | "Aprobada"
  | "Rechazada"
  | "Modificada"
  | "Enviada a PeopleSoft"
  | "Error integración";

const requests: {
  id: string;
  client: string;
  date: string;
  provider: string;
  status: Status;
  value: string;
}[] = [
  { id: "PR-2026-000245", client: "Distribuidora del Valle S.A.S.", date: "28/05/2026 09:15 a. m.", provider: "Castrol", status: "Pendiente", value: "$ 12.450.000" },
  { id: "PR-2026-000244", client: "Moto Repuestos del Norte", date: "28/05/2026 08:47 a. m.", provider: "Castrol", status: "Espera proveedor", value: "$ 8.230.000" },
  { id: "PR-2026-000243", client: "Comercializadora Andina", date: "28/05/2026 07:38 a. m.", provider: "Castrol", status: "Enviada a PeopleSoft", value: "$ 5.980.000" },
  { id: "PR-2026-000242", client: "Lubricantes del Sur Ltda.", date: "27/05/2026 04:22 p. m.", provider: "Castrol", status: "Modificada", value: "$ 3.120.000" },
  { id: "PR-2026-000241", client: "Autopartes del Caribe", date: "27/05/2026 02:11 p. m.", provider: "Castrol", status: "Error integración", value: "$ 9.760.000" },
];

const activity = [
  { icon: CheckCircle2, tone: "success" as const, text: "PR-2026-000243 fue aprobada", sub: "por Juan Pérez", time: "Hace 35 min" },
  { icon: Clock, tone: "warning" as const, text: "Castrol respondió solicitud", sub: "PR-2026-000244", time: "Hace 1 hora" },
  { icon: FileText, tone: "primary" as const, text: "Nueva solicitud PR-2026-000245", sub: "creada por Luis Gómez", time: "Hace 2 horas" },
  { icon: XCircle, tone: "destructive" as const, text: "PR-2026-000238 fue rechazada", sub: "por María López", time: "Hace 3 horas" },
];

type DonutSeg = { label: string; count: number; valueM: number; color: string };
const donutData: DonutSeg[] = [
  { label: "Pendientes", count: 18, valueM: 214, color: "var(--primary)" },
  { label: "Espera proveedor", count: 7, valueM: 52, color: "var(--warning)" },
  { label: "Aprobadas", count: 24, valueM: 138, color: "var(--success)" },
  { label: "Rechazadas", count: 5, valueM: 18, color: "var(--destructive)" },
  { label: "Canceladas", count: 2, valueM: 6, color: "oklch(0.78 0.005 250)" },
];

const overdueBase = [
  { id: "PR-2026-000241", supplier: "Autopartes del Caribe", deadline: "Vence 5pm", tone: "destructive" as const, sku: "8806094567891", item: "Refrigerador Samsung RT38 380L", desc: "DTO-001", providerName: "Samsung Colombia S.A.", qty: 5, listPrice: "$ 2.450.000", corbetaPct: "3.5%", supplierPct: "5.0%", totalPct: "8.5%", supplierResp: "Aprobado" },
  { id: "PR-2026-000238", supplier: "Lubricantes Sur", deadline: "Vence 6pm", tone: "destructive" as const, sku: "8806094567238", item: "Aceite Castrol GTX 20W-50", desc: "DTO-014", providerName: "Castrol Colombia S.A.", qty: 120, listPrice: "$ 85.000", corbetaPct: "4.0%", supplierPct: "6.0%", totalPct: "10.0%", supplierResp: "Aprobado" },
  { id: "PR-2026-000235", supplier: "Moto Repuestos", deadline: "Vence mañana", tone: "warning" as const, sku: "8806094567235", item: "Pastillas freno moto AKT 125", desc: "DTO-022", providerName: "AKT Motos S.A.", qty: 50, listPrice: "$ 38.500", corbetaPct: "2.5%", supplierPct: "4.5%", totalPct: "7.0%", supplierResp: "Aprobado" },
];

type OverdueItem = (typeof overdueBase)[number];
type Decision = "approve" | "reject" | "modify" | "cancel";

const supplierWait = [
  { name: "Castrol", hours: 31, status: "Vencida" as const },
  { name: "Shell", hours: 18, status: "En riesgo" as const },
  { name: "Mobil", hours: 4, status: "A tiempo" as const },
];

const zones = [
  { name: "Zona Norte", value: 24, pct: 100 },
  { name: "Zona Centro", value: 18, pct: 75 },
  { name: "Zona Occidente", value: 12, pct: 50 },
  { name: "Zona Sur", value: 8, pct: 33 },
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

function toneClass(tone: Tone) {
  const map = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/20 text-foreground",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return map[tone];
}

function Donut({ mode }: { mode: "count" | "value" }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const total = donutData.reduce((s, d) => s + (mode === "count" ? d.count : d.valueM), 0);
  let offset = 0;
  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--muted)" strokeWidth="18" />
        {donutData.map((seg) => {
          const v = mode === "count" ? seg.count : seg.valueM;
          const len = (v / total) * circ;
          const el = (
            <circle
              key={seg.label}
              cx="90" cy="90" r={radius} fill="none"
              stroke={seg.color} strokeWidth="18"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">
          {mode === "count" ? total : `$${total}M`}
        </div>
        <div className="text-xs text-muted-foreground">Total</div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [donutMode, setDonutMode] = useState<"count" | "value">("count");
  const [processed, setProcessed] = useState<Set<string>>(new Set());
  const [gestion, setGestion] = useState<OverdueItem | null>(null);

  const overdue = useMemo(
    () => overdueBase.filter((o) => !processed.has(o.id)),
    [processed]
  );

  const handleConfirm = (id: string) => {
    setProcessed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setGestion(null);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardOverviewSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            ¡Bienvenido, Moises Carmona! <span className="inline-block">👋</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí tienes el resumen de tus solicitudes y aprobaciones.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:bg-accent">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Hoy, 28 de mayo de 2026
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const deltaCls =
            s.deltaTone === "warn"
              ? "text-destructive"
              : s.deltaTone === "success"
                ? "text-[oklch(0.45_0.13_160)]"
                : "text-muted-foreground";
          return (
            <div key={s.label} className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass(s.tone)}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{s.label}</div>
                <div className={`mt-2 text-[11px] font-medium ${deltaCls}`}>{s.delta}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Overdue banner */}
      <section className="rounded-xl border border-warning/40 bg-warning/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-warning">
          <AlertTriangle className="h-4 w-4" /> {overdue.length} solicitudes vencen hoy
        </div>
        <ul className="mt-3 divide-y divide-warning/20">
          {overdue.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <Link to="/panel/preordenes/$id" params={{ id: o.id }} className="hover:underline min-w-0 flex-1 truncate">
                <span className="font-medium">{o.id}</span>
                <span className="text-muted-foreground"> · {o.supplier}</span>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    o.tone === "destructive"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {o.deadline}
                </span>
                <button
                  onClick={() => setGestion(o)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium hover:bg-accent"
                  aria-label={`Gestionar ${o.id}`}
                >
                  <Pencil className="h-3 w-3" /> Gestionar
                </button>
              </div>
            </li>
          ))}
          {overdue.length === 0 && (
            <li className="py-3 text-center text-xs text-muted-foreground">
              No hay solicitudes pendientes por vencer.
            </li>
          )}
        </ul>
      </section>

      {gestion && (
        <GestionModal item={gestion} onClose={() => setGestion(null)} onConfirm={handleConfirm} />
      )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList className="h-4 w-4" />
              </div>
              <h3 className="text-base font-semibold">Solicitudes recientes</h3>
            </div>
            <Link to="/panel/preordenes" className="text-xs font-medium text-primary hover:underline">Ver todas</Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            {["Estado: Todos", "Zona: Todas", "Proveedor: Todos"].map((f) => (
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
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`h-8 w-1 rounded-full ${statusBar(r.status)}`} />
                        <span className="font-medium text-foreground">{r.id}</span>
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
                        <Link to="/panel/preordenes/$id" params={{ id: r.id }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* Supplier wait */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Tiempo de espera proveedor</h3>
              <Link to="/panel/portal-proveedor" className="text-xs font-medium text-primary hover:underline">Ver</Link>
            </div>
            <div className="mt-4 grid grid-cols-3 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              <span>Proveedor</span>
              <span>Espera</span>
              <span>Estado</span>
            </div>
            <ul>
              {supplierWait.map((s) => {
                const isOver = s.hours >= 24;
                const isRisk = s.hours >= 12 && !isOver;
                const txt = isOver ? "text-destructive" : isRisk ? "text-warning" : "text-[oklch(0.45_0.13_160)]";
                return (
                  <li key={s.name} className="grid grid-cols-3 items-center py-2.5 text-sm border-b border-border last:border-none">
                    <span className="font-medium">{s.name}</span>
                    <span className={`font-semibold tabular-nums ${txt}`}>
                      {s.hours}h {isOver && <span className="ml-1">⚠</span>}
                    </span>
                    <span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isOver
                            ? "bg-destructive/10 text-destructive"
                            : isRisk
                              ? "bg-warning/10 text-warning"
                              : "bg-success/15 text-foreground"
                        }`}
                      >
                        {s.status}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Donut with toggle */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Aprobaciones por estado</h3>
              <div className="inline-flex rounded-md border border-border p-0.5 text-[11px] font-medium">
                <button
                  onClick={() => setDonutMode("count")}
                  className={`px-2 py-1 rounded ${donutMode === "count" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  # Solicitudes
                </button>
                <button
                  onClick={() => setDonutMode("value")}
                  className={`px-2 py-1 rounded ${donutMode === "value" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  $ Valor
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <Donut mode={donutMode} />
              <ul className="flex-1 space-y-2.5">
                {donutData.map((d) => (
                  <li key={d.label} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="flex-1 text-foreground/90">{d.label}</span>
                    <span className="font-medium tabular-nums text-muted-foreground">
                      {donutMode === "count" ? d.count : `$${d.valueM}M`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Tiempos promedio de aprobación</h3>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Interno (Corbeta)
              </div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">
                12.4 <span className="text-base font-normal text-muted-foreground">h</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium">
                <TrendingDown className="h-3 w-3 text-[oklch(0.6_0.15_160)]" />
                <span className="text-[oklch(0.45_0.13_160)]">8% vs sem. anterior</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Proveedor
              </div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">
                18.7 <span className="text-base font-normal text-muted-foreground">h</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-warning">
                <TrendingUp className="h-3 w-3" /> 5% vs sem. anterior
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Solicitudes por zona</h3>
          <ul className="mt-5 space-y-3.5">
            {zones.map((z) => (
              <li key={z.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{z.name}</span>
                  <span className="tabular-nums text-muted-foreground">{z.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${z.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Actividad reciente</h3>
          <ul className="mt-3 space-y-1">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <li key={i} className="flex gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClass(a.tone)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
