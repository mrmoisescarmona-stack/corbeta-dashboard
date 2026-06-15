import { createFileRoute, Link } from "@tanstack/react-router";
import { User, CheckCircle2, Clock, XCircle, Pencil, Eye } from "lucide-react";

export const Route = createFileRoute("/dashboard/sales-rep")({
  head: () => ({ meta: [{ title: "Vista vendedor · Corbeta" }] }),
  component: SalesRepPage,
});

const myPreorders = [
  { id: "PR-2024-000245", client: "Distribuidora del Valle", lines: 4, approved: 2, modified: 1, rejected: 0, pending: 1, value: "$ 12.450.000" },
  { id: "PR-2024-000244", client: "Moto Repuestos Norte", lines: 3, approved: 0, modified: 0, rejected: 0, pending: 3, value: "$ 8.230.000" },
  { id: "PR-2024-000243", client: "Comercializadora Andina", lines: 5, approved: 5, modified: 0, rejected: 0, pending: 0, value: "$ 5.980.000" },
  { id: "PR-2024-000242", client: "Lubricantes del Sur", lines: 2, approved: 0, modified: 0, rejected: 2, pending: 0, value: "$ 3.120.000" },
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
            Seguimiento del estado por línea de cada preorden enviada desde CorbeMóvil. Registra notas o soportes adicionales.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-5 py-3">Preorden</th>
                <th className="font-medium px-3 py-3">Cliente</th>
                <th className="font-medium px-3 py-3 text-center">Líneas</th>
                <th className="font-medium px-3 py-3 text-center">Aprob.</th>
                <th className="font-medium px-3 py-3 text-center">Mod.</th>
                <th className="font-medium px-3 py-3 text-center">Rech.</th>
                <th className="font-medium px-3 py-3 text-center">Pend.</th>
                <th className="font-medium px-3 py-3 text-right">Valor</th>
                <th className="font-medium px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {myPreorders.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-medium">{p.id}</td>
                  <td className="px-3 py-3.5">{p.client}</td>
                  <td className="px-3 py-3.5 text-center tabular-nums">{p.lines}</td>
                  <td className="px-3 py-3.5 text-center"><Pill icon={CheckCircle2} value={p.approved} tone="success" /></td>
                  <td className="px-3 py-3.5 text-center"><Pill icon={Pencil} value={p.modified} tone="warning" /></td>
                  <td className="px-3 py-3.5 text-center"><Pill icon={XCircle} value={p.rejected} tone="destructive" /></td>
                  <td className="px-3 py-3.5 text-center"><Pill icon={Clock} value={p.pending} tone="primary" /></td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{p.value}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to="/dashboard/preorders/$id" params={{ id: p.id }} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
                      <Eye className="h-3.5 w-3.5" /> Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, value, tone }: { icon: any; value: number; tone: "success" | "warning" | "destructive" | "primary" }) {
  if (value === 0) return <span className="text-xs text-muted-foreground tabular-nums">—</span>;
  const map = {
    success: "bg-success/15 text-foreground ring-success/30",
    warning: "bg-warning/10 text-warning ring-warning/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
    primary: "bg-primary/10 text-primary ring-primary/20",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${map[tone]}`}>
      <Icon className="h-3 w-3" /> {value}
    </span>
  );
}
