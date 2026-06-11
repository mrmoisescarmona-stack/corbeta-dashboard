import { createFileRoute } from "@tanstack/react-router";
import { Search, ChevronDown, Filter, CheckCircle2, FileText, XCircle, Clock } from "lucide-react";
import { AuditSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/audit")({
  head: () => ({ meta: [{ title: "Auditoría · Corbeta" }] }),
  component: AuditPage,
  pendingComponent: AuditSkeleton,
});

const events = Array.from({ length: 10 }).map((_, i) => {
  const types = [
    { icon: CheckCircle2, tone: "bg-success/20 text-foreground", text: "Aprobó solicitud", target: "PR-2024-000243" },
    { icon: XCircle, tone: "bg-destructive/10 text-destructive", text: "Rechazó solicitud", target: "PR-2024-000238" },
    { icon: FileText, tone: "bg-primary/10 text-primary", text: "Creó solicitud", target: "PR-2024-000245" },
    { icon: Clock, tone: "bg-warning/10 text-warning", text: "Reasignó solicitud", target: "PR-2024-000241" },
  ];
  const t = types[i % 4];
  return { ...t, user: ["Juan Pérez", "María López", "Luis Gómez", "Ana Carolina"][i % 4], time: `Hace ${i + 1}h`, ip: `10.0.${i}.${i + 12}` };
});

function AuditPage() {
  if (useFakeLoading()) return <AuditSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Auditoría</h2>
          <p className="mt-1 text-sm text-muted-foreground">Registro histórico de eventos del sistema.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:bg-accent">
          Exportar registro
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Buscar evento, usuario o ID…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        {["Tipo: Todos", "Usuario: Todos", "Módulo: Todos", "Fecha: 7 días"].map((f) => (
          <button key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
            {f} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        ))}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
          <Filter className="h-3.5 w-3.5" /> Filtros
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <li key={i} className="flex items-start gap-4 p-4 hover:bg-muted/40">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${e.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{e.user}</span>{" "}
                    <span className="text-muted-foreground">{e.text}</span>{" "}
                    <span className="font-medium">{e.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">IP {e.ip} · Módulo: Aprobaciones</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{e.time}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">28/05/2024</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
