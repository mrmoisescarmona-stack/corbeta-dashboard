import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, CheckCircle2, XCircle, Pencil, Send, Eye } from "lucide-react";

export const Route = createFileRoute("/dashboard/resolutions")({
  head: () => ({ meta: [{ title: "Resultados finales · Corbeta" }] }),
  component: ResolutionsPage,
});

const resolutions = [
  { id: "PR-2024-000243", client: "Comercializadora Andina", approved: 5, modified: 0, rejected: 0, notified: true, vendor: "Luis Quintero", at: "28/05/2024 11:02" },
  { id: "PR-2024-000241", client: "Autopartes del Caribe", approved: 3, modified: 1, rejected: 1, notified: true, vendor: "Andrés Ruiz", at: "28/05/2024 10:48" },
  { id: "PR-2024-000240", client: "Lubricantes del Norte", approved: 2, modified: 0, rejected: 2, notified: false, vendor: "Sofía Mora", at: "28/05/2024 09:35" },
];

function ResolutionsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">Cierre</span>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Resultados finales</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preordenes con decisión cerrada en todas sus líneas. Desde aquí se dispara la notificación al vendedor.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2.5 p-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Flag className="h-4 w-4" /></div>
          <h3 className="text-base font-semibold">Preordenes resueltas</h3>
        </div>
        <ul className="divide-y divide-border">
          {resolutions.map((r) => (
            <li key={r.id} className="p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-medium">{r.id}</div>
                <div className="text-xs text-muted-foreground">{r.client} · Vendedor {r.vendor}</div>
              </div>
              <div className="flex items-center gap-2">
                <Chip icon={CheckCircle2} label="Aprob." value={r.approved} tone="success" />
                <Chip icon={Pencil} label="Mod." value={r.modified} tone="warning" />
                <Chip icon={XCircle} label="Rech." value={r.rejected} tone="destructive" />
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{r.at}</div>
              {r.notified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium ring-1 ring-success/30">
                  <Send className="h-3 w-3" /> Vendedor notificado
                </span>
              ) : (
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                  <Send className="h-3.5 w-3.5" /> Notificar vendedor
                </button>
              )}
              <Link to="/dashboard/preorders/$id" params={{ id: r.id }} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
                <Eye className="h-3.5 w-3.5" /> Ver
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Chip({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "success" | "warning" | "destructive" }) {
  const map = {
    success: "bg-success/15 text-foreground ring-success/30",
    warning: "bg-warning/10 text-warning ring-warning/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${map[tone]}`}>
      <Icon className="h-3 w-3" /> {label} {value}
    </span>
  );
}
