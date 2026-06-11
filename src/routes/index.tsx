import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
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
} from "lucide-react";
import logoAsset from "@/assets/logo_corbeta.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Corbeta · Gestor de Aprobaciones de Descuentos" },
      {
        name: "description",
        content:
          "Panel interno de Corbeta para gestionar y aprobar solicitudes de descuentos puntuales con proveedores.",
      },
      { property: "og:title", content: "Corbeta · Gestor de Aprobaciones" },
      {
        property: "og:description",
        content:
          "Resumen operativo de solicitudes, aprobaciones y tiempos de respuesta del equipo Corbeta.",
      },
    ],
  }),
  component: Dashboard,
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CheckSquare, label: "Mis aprobaciones" },
  { icon: FileText, label: "Solicitudes", chevron: true },
  { icon: BarChart3, label: "Reportes" },
  { icon: Users, label: "Proveedores" },
  { icon: Settings, label: "Configuración", chevron: true },
  { icon: ShieldCheck, label: "Auditoría" },
  { icon: Bell, label: "Notificaciones" },
];

const stats = [
  {
    label: "Pendientes de aprobar",
    value: 18,
    icon: ClipboardList,
    tone: "primary" as const,
    delta: "+3 hoy",
  },
  {
    label: "En espera de proveedor",
    value: 7,
    icon: Clock,
    tone: "warning" as const,
    delta: "2 vencen hoy",
  },
  {
    label: "Aprobadas hoy",
    value: 24,
    icon: CheckCircle2,
    tone: "success" as const,
    delta: "+12% vs ayer",
  },
  {
    label: "Rechazadas hoy",
    value: 5,
    icon: XCircle,
    tone: "destructive" as const,
    delta: "-1 vs ayer",
  },
  {
    label: "Canceladas hoy",
    value: 2,
    icon: Ban,
    tone: "muted" as const,
    delta: "Sin cambios",
  },
];

type Status = "Pendiente" | "Espera proveedor" | "Aprobada" | "Rechazada";

const requests: {
  id: string;
  client: string;
  date: string;
  provider: string;
  status: Status;
  value: string;
}[] = [
  {
    id: "PR-2024-000245",
    client: "Distribuidora del Valle S.A.S.",
    date: "28/05/2024 09:15 a. m.",
    provider: "Castrol",
    status: "Pendiente",
    value: "$ 12.450.000",
  },
  {
    id: "PR-2024-000244",
    client: "Moto Repuestos del Norte",
    date: "28/05/2024 08:47 a. m.",
    provider: "Castrol",
    status: "Espera proveedor",
    value: "$ 8.230.000",
  },
  {
    id: "PR-2024-000243",
    client: "Comercializadora Andina",
    date: "28/05/2024 07:38 a. m.",
    provider: "Castrol",
    status: "Aprobada",
    value: "$ 5.980.000",
  },
  {
    id: "PR-2024-000242",
    client: "Lubricantes del Sur Ltda.",
    date: "27/05/2024 04:22 p. m.",
    provider: "Castrol",
    status: "Rechazada",
    value: "$ 3.120.000",
  },
  {
    id: "PR-2024-000241",
    client: "Autopartes del Caribe",
    date: "27/05/2024 02:11 p. m.",
    provider: "Castrol",
    status: "Pendiente",
    value: "$ 9.760.000",
  },
];

const activity = [
  {
    icon: CheckCircle2,
    tone: "success" as const,
    text: "PR-2024-000243 fue aprobada",
    sub: "por Juan Pérez",
    time: "Hace 35 min",
  },
  {
    icon: Clock,
    tone: "warning" as const,
    text: "Castrol respondió solicitud",
    sub: "PR-2024-000244",
    time: "Hace 1 hora",
  },
  {
    icon: FileText,
    tone: "primary" as const,
    text: "Nueva solicitud PR-2024-000245",
    sub: "creada por Luis Gómez",
    time: "Hace 2 horas",
  },
  {
    icon: XCircle,
    tone: "destructive" as const,
    text: "PR-2024-000238 fue rechazada",
    sub: "por María López",
    time: "Hace 3 horas",
  },
];

const donutSegments = [
  { label: "Pendientes", value: 18, pct: 36, color: "var(--primary)" },
  { label: "Espera proveedor", value: 7, pct: 14, color: "var(--warning)" },
  { label: "Aprobadas", value: 24, pct: 48, color: "var(--success)" },
  { label: "Rechazadas", value: 5, pct: 10, color: "var(--destructive)" },
  { label: "Canceladas", value: 2, pct: 4, color: "oklch(0.78 0.005 250)" },
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
    "Espera proveedor":
      "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
    Aprobada: "bg-success/15 text-foreground ring-1 ring-inset ring-success/30",
    Rechazada:
      "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20",
  };
  return map[status];
}

function statusBar(status: Status) {
  const map: Record<Status, string> = {
    Pendiente: "bg-primary",
    "Espera proveedor": "bg-warning",
    Aprobada: "bg-success",
    Rechazada: "bg-destructive",
  };
  return map[status];
}

function toneClass(tone: "primary" | "warning" | "success" | "destructive" | "muted") {
  const map = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/20 text-foreground",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return map[tone];
}

function Donut() {
  const total = donutSegments.reduce((s, d) => s + d.value, 0);
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--muted)" strokeWidth="18" />
        {donutSegments.map((seg) => {
          const len = (seg.pct / 100) * circ;
          const el = (
            <circle
              key={seg.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
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
        <div className="text-3xl font-semibold tracking-tight">{total}</div>
        <div className="text-xs text-muted-foreground">Total</div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <img src={logoAsset.url} alt="Corbeta" className="h-6 w-auto" />
          </div>
          <nav className="flex-1 px-3 py-5 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      item.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.chevron && (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="px-6 py-4 border-t border-sidebar-border">
            <div className="text-xs font-medium text-foreground">Corbeta S.A.</div>
            <div className="text-[11px] text-muted-foreground">Versión 1.0.0</div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur">
            <button className="md:hidden -ml-1 p-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm md:text-base font-semibold text-foreground truncate">
              Gestor de Aprobaciones de Descuentos Puntuales
            </h1>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden lg:flex relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar preorden, cliente o proveedor…"
                  className="w-full rounded-lg border border-input bg-card pl-9 pr-14 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
              <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-semibold text-warning-foreground">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card pl-1 pr-3 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                  AC
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-semibold">Ana Carolina</div>
                  <div className="text-[11px] text-muted-foreground">
                    Aprobador Interno
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 md:px-8 py-6 md:py-8 space-y-6">
            {/* Welcome */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  ¡Bienvenida, Ana Carolina! <span className="inline-block">👋</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aquí tienes el resumen de tus solicitudes y aprobaciones.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:bg-accent">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Hoy, 28 de mayo de 2024
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass(
                          s.tone,
                        )}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {s.delta}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-semibold tracking-tight tabular-nums">
                        {s.value}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground leading-snug">
                        {s.label}
                      </div>
                    </div>
                    <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      Ver todas <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </section>

            {/* Main grid */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Requests table */}
              <div className="xl:col-span-2 rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold">Solicitudes recientes</h3>
                  </div>
                  <button className="text-xs font-medium text-primary hover:underline">
                    Ver todas
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      placeholder="Buscar…"
                      className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  {["Estado: Todos", "Zona: Todas", "Proveedor: Todos"].map((f) => (
                    <button
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
                    >
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
                        <tr
                          key={r.id}
                          className="border-t border-border hover:bg-muted/40 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span
                                className={`h-8 w-1 rounded-full ${statusBar(r.status)}`}
                              />
                              <span className="font-medium text-foreground">{r.id}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-foreground/90">{r.client}</td>
                          <td className="px-3 py-3.5 text-muted-foreground tabular-nums">
                            {r.date}
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                              {r.provider}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge(
                                r.status,
                              )}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-right font-medium tabular-nums">
                            {r.value}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                                <Eye className="h-4 w-4" />
                              </button>
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

                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Mostrando 1 a 5 de 25 resultados
                  </span>
                  <div className="flex items-center gap-1">
                    {["‹", "1", "2", "3", "…", "5", "›"].map((p, i) => (
                      <button
                        key={i}
                        className={`min-w-8 h-8 rounded-md border border-border px-2 text-xs font-medium ${
                          p === "1"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-accent"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Activity */}
                <div className="rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="text-base font-semibold">Actividad reciente</h3>
                    <button className="text-xs font-medium text-primary hover:underline">
                      Ver todo
                    </button>
                  </div>
                  <ul className="p-2">
                    {activity.map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <li
                          key={i}
                          className="flex gap-3 rounded-lg p-3 hover:bg-muted/50"
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClass(
                              a.tone,
                            )}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug text-foreground">
                              {a.text}
                            </p>
                            <p className="text-xs text-muted-foreground">{a.sub}</p>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {a.time}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Donut */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-base font-semibold">Aprobaciones por estado</h3>
                  <div className="mt-4 flex items-center gap-6">
                    <Donut />
                    <ul className="flex-1 space-y-2.5">
                      {donutSegments.map((d) => (
                        <li
                          key={d.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-sm"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="flex-1 text-foreground/90">
                            {d.label} ({d.value})
                          </span>
                          <span className="font-medium tabular-nums text-muted-foreground">
                            {d.pct}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom row */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Times */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">
                  Tiempos promedio de aprobación
                </h3>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Interno (Corbeta)
                    </div>
                    <div className="mt-2 text-3xl font-semibold tabular-nums">
                      12.4 <span className="text-base font-normal text-muted-foreground">h</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-success-foreground">
                      <TrendingDown className="h-3 w-3 text-[oklch(0.6_0.15_160)]" />
                      <span className="text-[oklch(0.45_0.13_160)]">8% vs sem. anterior</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Proveedor
                    </div>
                    <div className="mt-2 text-3xl font-semibold tabular-nums">
                      18.7 <span className="text-base font-normal text-muted-foreground">h</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-warning">
                      <TrendingUp className="h-3 w-3" />
                      5% vs sem. anterior
                    </div>
                  </div>
                </div>
              </div>

              {/* Zones */}
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
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${z.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick actions */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Acciones rápidas</h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { icon: Plus, label: "Nueva solicitud", tone: "primary" as const },
                    { icon: Upload, label: "Subir archivo", tone: "success" as const },
                    { icon: BarChart3, label: "Ver reportes", tone: "warning" as const },
                    { icon: Bell, label: "Notificaciones", tone: "destructive" as const },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.label}
                        className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-background p-3.5 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClass(
                            a.tone,
                          )}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium leading-tight">
                          {a.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
