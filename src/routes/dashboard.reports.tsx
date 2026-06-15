import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ChevronDown, TrendingUp, TrendingDown, Search, Download, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReportsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reportes · Corbeta" }] }),
  component: ReportsPage,
  pendingComponent: ReportsSkeleton,
});

const stats = [
  { label: "Solicitudes (mes)", value: "245", delta: "+18%" },
  { label: "Tasa de aprobación", value: "68%", delta: "+4%" },
  { label: "Tiempo medio interno", value: "12.4h", delta: "-8%" },
  { label: "Valor aprobado", value: "$ 184M", delta: "+22%" },
];

const MONTHS = ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"];

function makeSeries(seed: number, base: number, variance: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return MONTHS.map((m) => ({ month: m, value: Math.round(base + rand() * variance) }));
}

function makeDualSeries(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return MONTHS.map((m) => ({
    month: m,
    aprobadas: Math.round(120 + rand() * 80),
    rechazadas: Math.round(20 + rand() * 40),
  }));
}

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
      <div className="space-y-1">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="font-semibold tabular-nums">
              {formatter ? formatter(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AreaChartCard({
  title,
  subtitle,
  data,
  color,
  gradientId,
  valueLabel,
  formatter,
  current,
  delta,
  deltaPositive = true,
}: {
  title: string;
  subtitle?: string;
  data: { month: string; value: number }[];
  color: string;
  gradientId: string;
  valueLabel: string;
  formatter?: (v: number) => string;
  current: string;
  delta: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
          Últimos 12 meses <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-semibold tabular-nums">{current}</div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            deltaPositive
              ? "bg-success/15 text-success ring-1 ring-success/30"
              : "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
          )}
        >
          {deltaPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>

      <div className="h-56 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={formatter}
            />
            <Tooltip
              cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<ChartTooltip formatter={formatter} />}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DualLineChartCard({ title, subtitle }: { title: string; subtitle?: string }) {
  const data = makeDualSeries(77);
  const approvedColor = "oklch(0.62 0.16 155)";
  const rejectedColor = "oklch(0.62 0.2 25)";
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: approvedColor }} />
            Aprobadas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rejectedColor }} />
            Rechazadas
          </span>
        </div>
      </div>
      <div className="h-72 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.5} />

            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
            <Tooltip cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }} content={<ChartTooltip />} />
            <Line type="monotone" dataKey="aprobadas" name="Aprobadas" stroke={approvedColor} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
            <Line type="monotone" dataKey="rechazadas" name="Rechazadas" stroke={rejectedColor} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const donut = [
  { label: "Aprobadas", value: 168, pct: 68, color: "var(--success)" },
  { label: "Rechazadas", value: 32, pct: 13, color: "var(--destructive)" },
  { label: "Pendientes", value: 30, pct: 12, color: "var(--primary)" },
  { label: "Espera prov.", value: 15, pct: 7, color: "var(--warning)" },
];

function ReportsPage() {
  if (useFakeLoading()) return <ReportsSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <TraceabilitySection />

      <div className="flex flex-wrap items-start justify-between gap-4 pt-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Reportes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Indicadores operativos y desempeño del equipo.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:bg-accent">
          <BarChart3 className="h-4 w-4 text-muted-foreground" /> Exportar reporte
        </button>
      </div>


      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl font-semibold tabular-nums">{s.value}</div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success-foreground">
                <TrendingUp className="h-3 w-3 text-[oklch(0.6_0.15_160)]" />
                <span className="text-[oklch(0.45_0.13_160)]">{s.delta}</span>
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartCard
          title="Solicitudes por mes"
          subtitle="Últimos 12 meses"
          data={makeSeries(11, 80, 180)}
          color="oklch(0.55 0.2 260)"
          gradientId="grad-solicitudes"
          valueLabel="Solicitudes"
          current="2.847"
          delta="+18%"
        />
        <AreaChartCard
          title="Valor aprobado por mes"
          subtitle="Últimos 12 meses"
          data={makeSeries(29, 40, 160).map((d) => ({ ...d, value: d.value * 2 }))}
          color="oklch(0.62 0.16 155)"
          gradientId="grad-valor"
          valueLabel="Valor aprobado"
          formatter={(v: number) => `$${v}M`}
          current="$ 184M"
          delta="+22%"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Distribución por estado</h3>
          <ul className="mt-5 space-y-3">
            {donut.map((d) => (
              <li key={d.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{d.label}</span>
                  <span className="tabular-nums text-muted-foreground">{d.value} · {d.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <DualLineChartCard title="Tendencia de aprobaciones vs rechazos" subtitle="Últimos 12 meses" />
        </div>
      </section>

    </div>
  );
}

const traceResults = [
  {
    id: "PO-2026-004510",
    client: "Tiendas del Pacífico",
    nit: "901567890",
    ean: "8806074567894",
    product: "Nevera Whirlpool WRE57 450L",
    qty: 4,
    prov: "3.5%",
    corb: "2.5%",
    total: "6.0%",
    status: "Aprobada" as const,
    approver: "María González",
    supplier: "Whirlpool Andina",
    reception: "7/06/2026, 9:01 a. m.",
    management: "7/06/2026, 11:35 a. m.",
  },
  {
    id: "PO-2026-004505",
    client: "Almacenes del Centro",
    nit: "800234567",
    ean: "8806094567891",
    product: "Refrigerador Samsung RT38 380L",
    qty: 2,
    prov: "0.0%",
    corb: "0.0%",
    total: "0.0%",
    status: "Rechazada" as const,
    approver: "Pedro Martínez",
    supplier: "Samsung Colombia S.A.",
    reception: "6/06/2026, 3:20 p. m.",
    management: "6/06/2026, 4:10 p. m.",
  },
];

function TraceabilitySection() {
  return (
    <section className="space-y-6 pt-2">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Reportes y Trazabilidad</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta histórica y descarga de reportes de descuentos puntuales.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Filtros de consulta</h3>
        </div>
        <div className="p-5 grid gap-4 md:grid-cols-3">
          <Field label="Fecha inicio" required>
            <DateField defaultDate={new Date(2026, 5, 1)} />
          </Field>
          <Field label="Fecha fin" required>
            <DateField defaultDate={new Date(2026, 5, 30)} />
          </Field>
          <Field label="Aprobador">
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
              <option>Seleccionar…</option>
              <option>María González</option>
              <option>Pedro Martínez</option>
            </select>
          </Field>
          <Field label="Proveedor">
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
              <option>Seleccionar…</option>
              <option>Whirlpool Andina</option>
              <option>Samsung Colombia S.A.</option>
            </select>
          </Field>
          <Field label="Zona">
            <input type="text" placeholder="Ej: Bogotá Norte" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </Field>
        </div>
        <div className="px-5 pb-5 flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Search className="h-4 w-4" /> Consultar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            <Download className="h-4 w-4" /> Exportar Excel (CSV)
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Resultados ({traceResults.length})</h3>
          <p className="mt-1 text-xs text-muted-foreground">Información actualizada a la fecha de gestión de cada solicitud</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="px-5 py-3 font-medium">Preorden</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">EAN</th>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Cant.</th>
                <th className="px-5 py-3 font-medium">% Prov.</th>
                <th className="px-5 py-3 font-medium">% Corb.</th>
                <th className="px-5 py-3 font-medium">% Total</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Aprobador</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 font-medium">Recepción</th>
                <th className="px-5 py-3 font-medium">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {traceResults.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link to="/dashboard/preorders/$id" params={{ id: r.id }} className="font-medium text-primary hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{r.client}</div>
                    <div className="text-xs text-muted-foreground">{r.nit}</div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground tabular-nums">{r.ean}</td>
                  <td className="px-5 py-4">{r.product}</td>
                  <td className="px-5 py-4 tabular-nums">{r.qty}</td>
                  <td className="px-5 py-4 tabular-nums">{r.prov}</td>
                  <td className="px-5 py-4 tabular-nums">{r.corb}</td>
                  <td className="px-5 py-4 tabular-nums font-medium">{r.total}</td>
                  <td className="px-5 py-4">
                    {r.status === "Aprobada" ? (
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success ring-1 ring-success/30">Aprobada</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive ring-1 ring-destructive/20">Rechazada</span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">{r.approver}</td>
                  <td className="px-5 py-4 whitespace-nowrap">{r.supplier}</td>
                  <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{r.reception}</td>
                  <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{r.management}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function DateField({ defaultDate }: { defaultDate?: Date }) {
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30",
            !date && "text-muted-foreground",
          )}
        >
          <span>{date ? format(date, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}</span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={es}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
