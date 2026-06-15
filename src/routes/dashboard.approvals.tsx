import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

type Approver = {
  name: string;
  id: string;
  direction: string;
  division: string;
  active: boolean;
  email: string;
  phone: string;
  manager: string;
  zone: string;
  unit: string;
  startDate: string;
  scopes: { code: string; description: string; limit: string; status: "Activo" | "Pendiente" }[];
};

const approvers: Approver[] = [
  {
    name: "María González",
    id: "52123456",
    direction: "Electrodomésticos",
    division: "Línea Blanca",
    active: true,
    email: "maria.gonzalez@corbeta.com",
    phone: "3101234567",
    manager: "Roberto Díaz",
    zone: "Bogotá Norte",
    unit: "Bogotá Norte",
    startDate: "2024-03-15",
    scopes: [
      { code: "SC-001", description: "Aprobación descuentos puntuales hasta 8%", limit: "8%", status: "Activo" },
      { code: "SC-002", description: "Aprobación descuentos por volumen", limit: "12%", status: "Activo" },
    ],
  },
  {
    name: "Pedro Martínez",
    id: "79123456",
    direction: "Tecnología",
    division: "Computación",
    active: true,
    email: "pedro.martinez@corbeta.com",
    phone: "3119876543",
    manager: "Ana Ruiz",
    zone: "Medellín",
    unit: "Antioquia Centro",
    startDate: "2023-09-01",
    scopes: [
      { code: "SC-010", description: "Aprobación descuentos línea Cómputo", limit: "10%", status: "Activo" },
    ],
  },
  {
    name: "Laura Sánchez",
    id: "35123456",
    direction: "Hogar",
    division: "Muebles",
    active: false,
    email: "laura.sanchez@corbeta.com",
    phone: "3134567890",
    manager: "Carlos Vega",
    zone: "Cali",
    unit: "Valle",
    startDate: "2022-01-10",
    scopes: [
      { code: "SC-020", description: "Aprobación descuentos línea Muebles", limit: "6%", status: "Pendiente" },
    ],
  },
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

function PillBadge({ label, tone = "warning" }: { label: string; tone?: "warning" | "success" | "muted" }) {
  const styles =
    tone === "success"
      ? "bg-success/20 text-success-foreground"
      : tone === "muted"
      ? "bg-muted text-muted-foreground"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${styles}`}>
      {label}
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

function InfoCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h4 className="text-base font-semibold mb-4">{title}</h4>
      <dl className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ApproverDetailDialog({ approver, onClose }: { approver: Approver | null; onClose: () => void }) {
  return (
    <Dialog open={!!approver} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {approver && (
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-2xl">Aprobador {approver.id}</DialogTitle>
                  <DialogDescription className="mt-1">
                    Detalle del aprobador y permisos asignados (HU_002)
                  </DialogDescription>
                </div>
                <PillBadge label={approver.active ? "Activo" : "Inactivo"} tone={approver.active ? "success" : "muted"} />
              </div>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                title="Información personal"
                rows={[
                  { label: "Nombre", value: approver.name },
                  { label: "Identificación", value: approver.id },
                  { label: "Email", value: approver.email },
                  { label: "Celular", value: approver.phone },
                ]}
              />
              <InfoCard
                title="Información organizacional"
                rows={[
                  { label: "Dirección", value: approver.direction },
                  { label: "División", value: approver.division },
                  { label: "Gerente", value: approver.manager },
                  { label: "Zona", value: approver.zone },
                ]}
              />
              <InfoCard
                title="Datos de asignación"
                rows={[
                  { label: "Unidad de negocio", value: approver.unit },
                  { label: "Fecha de alta", value: approver.startDate },
                  { label: "Estado", value: approver.active ? "Activo" : "Inactivo" },
                  { label: "Permisos", value: `${approver.scopes.length} alcance(s)` },
                ]}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">
                Permisos asignados ({approver.scopes.length})
              </h4>
              <div className="space-y-3">
                {approver.scopes.map((s) => (
                  <div key={s.code} className="rounded-xl border border-border bg-card">
                    <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-b border-border">
                      <div>
                        <div className="text-sm font-semibold">
                          {s.code} — {s.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Alcance asociado al rol de aprobador
                        </div>
                      </div>
                      <PillBadge label={s.status} tone={s.status === "Activo" ? "success" : "warning"} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 p-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Código</div>
                        <div className="font-medium tabular-nums">{s.code}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Límite de descuento</div>
                        <div className="font-medium tabular-nums">{s.limit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Estado</div>
                        <div className="font-medium">{s.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cerrar
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Guardar cambios
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ApprovalsPage() {
  const [tab, setTab] = useState<TabKey>("aprobadores");
  const [selected, setSelected] = useState<Approver | null>(null);
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
                        <button
                          onClick={() => setSelected(a)}
                          className="rounded-md p-1.5 hover:bg-accent"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
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

      <ApproverDetailDialog approver={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
