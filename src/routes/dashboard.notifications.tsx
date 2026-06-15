import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { useState } from "react";
import { NotificationsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notificaciones · Corbeta" }] }),
  component: NotificationsPage,
  pendingComponent: NotificationsSkeleton,
});

const tabs = ["Todas", "No leídas", "Aprobaciones", "Sistema"];

const items = Array.from({ length: 8 }).map((_, i) => {
  const types = [
    { icon: CheckCircle2, tone: "bg-success/20 text-foreground", title: "PR-2026-000243 fue aprobada", sub: "por Juan Pérez" },
    { icon: Clock, tone: "bg-warning/10 text-warning", title: "Castrol respondió PR-2026-000244", sub: "Requiere tu revisión" },
    { icon: FileText, tone: "bg-primary/10 text-primary", title: "Nueva solicitud PR-2026-000245", sub: "creada por Luis Gómez" },
    { icon: XCircle, tone: "bg-destructive/10 text-destructive", title: "PR-2026-000238 fue rechazada", sub: "por María López" },
  ];
  const t = types[i % 4];
  return { ...t, time: `Hace ${i + 1}h`, unread: i < 3 };
});

function NotificationsPage() {
  const [active, setActive] = useState("Todas");
  if (useFakeLoading()) return <NotificationsSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground ring-1 ring-success/30">Proveedor</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Notificaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">Log completo de notificaciones enviadas a proveedores y respuestas recibidas por línea.</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">Marcar todas como leídas</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${active === t ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-accent"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {items.map((n, i) => {
            const Icon = n.icon;
            return (
              <li key={i} className="flex items-start gap-4 p-4 hover:bg-muted/40">
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${n.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.sub}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
