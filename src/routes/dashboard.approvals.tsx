import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/approvals")({
  head: () => ({ meta: [{ title: "Parametrización del Workflow · Corbeta" }] }),
  component: ApprovalsPage,
  pendingComponent: ApprovalsSkeleton,
});

type TabKey = "aprobadores" | "sustitutos" | "proveedores" | "reasignacion";

const TABS: { key: TabKey; label: string }[] = [
  { key: "aprobadores", label: "Aprobadores" },
  { key: "sustitutos", label: "Sustitutos" },
  { key: "proveedores", label: "Proveedores" },
  { key: "reasignacion", label: "Reasignación" },
];

const approvers = [
  { name: "María González", id: "52123456", direction: "Electrodomésticos", division: "Línea Blanca", active: true },
  { name: "Pedro Martínez", id: "79123456", direction: "Tecnología", division: "Computación", active: true },
  { name: "Laura Sánchez", id: "35123456", direction: "Hogar", division: "Muebles", active: false },
];

const substitutes = [
  { approver: "Laura Sánchez", substitute: "María González", start: "2026-06-01", end: "2026-06-30" },
];

const providers = [
  { id: "900123456", name: "Samsung Colombia S.A.", category: "Electrodomésticos", email: "aprobaciones@samsung.com.co", active: true },
  { id: "900654321", name: "LG Electronics", category: "Tecnología", email: "descuentos@lg.com.co", active: true },
  { id: "900789012", name: "Whirlpool Andina", category: "Línea Blanca", email: "comercial@whirlpool.com.co", active: true },
];

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        active ? "bg-success/20 text-success-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 border-b border-border">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
      {children}
    </button>
  );
}

function ApprovalsPage() {
  const [tab, setTab] = useState<TabKey>("aprobadores");
  if (useFakeLoading()) return <ApprovalsSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Parametrización del Workflow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuración de reglas, aprobadores, sustitutos y proveedores (HU_002)
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "aprobadores" && (
        <SectionCard
          title="Aprobadores internos"
          subtitle="Configuración por dirección y división"
          action={
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Agregar
            </PrimaryButton>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium px-5 py-3">Nombre</th>
                  <th className="font-medium px-3 py-3">Identificación</th>
                  <th className="font-medium px-3 py-3">Dirección</th>
                  <th className="font-medium px-3 py-3">División</th>
                  <th className="font-medium px-3 py-3">Estado</th>
                  <th className="font-medium px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {approvers.map((a) => (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{a.name}</td>
                    <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{a.id}</td>
                    <td className="px-3 py-3.5">{a.direction}</td>
                    <td className="px-3 py-3.5">{a.division}</td>
                    <td className="px-3 py-3.5"><StatusBadge active={a.active} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-md p-1.5 hover:bg-accent" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                        <button className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === "sustitutos" && (
        <SectionCard
          title="Usuarios sustitutos"
          subtitle="Parametrización manual de sustitutos por aprobador (HU_002)"
          action={
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Asignar sustituto
            </PrimaryButton>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium px-5 py-3">Aprobador</th>
                  <th className="font-medium px-3 py-3">Sustituto</th>
                  <th className="font-medium px-3 py-3">Fecha inicio</th>
                  <th className="font-medium px-5 py-3">Fecha fin</th>
                </tr>
              </thead>
              <tbody>
                {substitutes.map((s, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{s.approver}</td>
                    <td className="px-3 py-3.5">{s.substitute}</td>
                    <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{s.start}</td>
                    <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{s.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === "proveedores" && (
        <SectionCard
          title="Proveedores"
          subtitle="Registro de proveedores por categoría — acuerdo SLS (HU_002)"
          action={
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Agregar
            </PrimaryButton>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium px-5 py-3">Identificación</th>
                  <th className="font-medium px-3 py-3">Nombre</th>
                  <th className="font-medium px-3 py-3">Categoría</th>
                  <th className="font-medium px-3 py-3">Email</th>
                  <th className="font-medium px-3 py-3">Estado</th>
                  <th className="font-medium px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium tabular-nums">{p.id}</td>
                    <td className="px-3 py-3.5">{p.name}</td>
                    <td className="px-3 py-3.5">{p.category}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{p.email}</td>
                    <td className="px-3 py-3.5"><StatusBadge active={p.active} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-md p-1.5 hover:bg-accent" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === "reasignacion" && (
        <SectionCard
          title="Reasignación de solicitudes"
          subtitle="Reasignación masiva o individual por rol superior (HU_002)"
          action={
            <PrimaryButton>
              <ArrowLeftRight className="h-4 w-4" /> Reasignar
            </PrimaryButton>
          }
        >
          <div className="p-8 text-sm text-muted-foreground">
            No hay reasignaciones registradas. Use el botón para reasignar solicitudes pendientes.
          </div>
        </SectionCard>
      )}
    </div>
  );
}
