import { createFileRoute, Link } from "@tanstack/react-router";
import { User, CheckCircle2, Clock, XCircle, Pencil, Eye } from "lucide-react";

export const Route = createFileRoute("/dashboard/sales-rep")({
  head: () => ({ meta: [{ title: "Vista vendedor · Corbeta" }] }),
  component: SalesRepPage,
});

type Phase = 1 | 2 | 3 | 4 | 5;
const PHASE_LABELS = ["Recibida", "Proveedor", "Aprobador", "Cierre", "PeopleSoft"];

const myPreorders: {
  id: string;
  client: string;
  lines: number;
  approved: number;
  modified: number;
  rejected: number;
  pending: number;
  value: string;
  phase: Phase;
  result: "En curso" | "Aprobada" | "Rechazada" | "Mixta";
}[] = [
  { id: "PR-2024-000245", client: "Distribuidora del Valle", lines: 4, approved: 2, modified: 1, rejected: 0, pending: 1, value: "$ 12.450.000", phase: 3, result: "En curso" },
  { id: "PR-2024-000244", client: "Moto Repuestos Norte", lines: 3, approved: 0, modified: 0, rejected: 0, pending: 3, value: "$ 8.230.000", phase: 2, result: "En curso" },
  { id: "PR-2024-000243", client: "Comercializadora Andina", lines: 5, approved: 5, modified: 0, rejected: 0, pending: 0, value: "$ 5.980.000", phase: 5, result: "Aprobada" },
  { id: "PR-2024-000242", client: "Lubricantes del Sur", lines: 2, approved: 0, modified: 0, rejected: 2, pending: 0, value: "$ 3.120.000", phase: 4, result: "Rechazada" },
];

function SalesRepPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><User className="h-5 w-5" /></div>
        <div>
          <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning">Fase 3 · Vendedor</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Mis preordenes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vista de solo lectura: avance por fase y resultado final de cada preorden enviada desde CorbeMóvil.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {myPreorders.map((p) => (
          <li key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-medium">{p.id} <span className="text-muted-foreground">· {p.client}</span></div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.lines} líneas · {p.value}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ResultBadge result={p.result} />
                <Link to="/dashboard/preorders/$id" params={{ id: p.id }} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
                  <Eye className="h-3.5 w-3.5" /> Ver
                </Link>
              </div>
            </div>

            {/* Phase progress */}
            <div className="mt-5">
              <div className="flex items-center">
                {PHASE_LABELS.map((label, i) => {
                  const step = (i + 1) as Phase;
                  const done = step < p.phase;
                  const current = step === p.phase;
                  return (
                    <div key={label} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center w-full">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                            done
                              ? "bg-success text-white"
                              : current
                                ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {done ? "✓" : step}
                        </div>
                        <span className={`mt-1.5 text-[10px] font-medium ${current ? "text-foreground" : "text-muted-foreground"}`}>
                          {label}
                        </span>
                      </div>
                      {i < PHASE_LABELS.length - 1 && (
                        <div className={`h-0.5 flex-1 -mt-4 ${step < p.phase ? "bg-success" : "bg-muted"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
              <Pill icon={CheckCircle2} value={p.approved} label="Aprob." tone="success" />
              <Pill icon={Pencil} value={p.modified} label="Mod." tone="warning" />
              <Pill icon={XCircle} value={p.rejected} label="Rech." tone="destructive" />
              <Pill icon={Clock} value={p.pending} label="Pend." tone="primary" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultBadge({ result }: { result: "En curso" | "Aprobada" | "Rechazada" | "Mixta" }) {
  const map = {
    "En curso": "bg-primary/10 text-primary",
    Aprobada: "bg-success/15 text-foreground ring-1 ring-success/30",
    Rechazada: "bg-destructive/10 text-destructive",
    Mixta: "bg-warning/10 text-warning",
  } as const;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[result]}`}>{result}</span>;
}

function Pill({ icon: Icon, value, label, tone }: { icon: any; value: number; label: string; tone: "success" | "warning" | "destructive" | "primary" }) {
  const map = {
    success: "bg-success/15 text-foreground ring-success/30",
    warning: "bg-warning/10 text-warning ring-warning/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
    primary: "bg-primary/10 text-primary ring-primary/20",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${map[tone]}`}>
      <Icon className="h-3 w-3" /> {value} {label}
    </span>
  );
}
