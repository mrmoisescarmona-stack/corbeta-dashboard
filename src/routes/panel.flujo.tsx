import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeftRight, Check, X, Ban, UploadCloud, Mail, Eye, Download } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/panel/flujo")({
  head: () => ({ meta: [{ title: "Parametrización del Flujo · Corbeta" }] }),
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
  status?: "Activo" | "Inactivo" | "Pendiente";
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
    status: "Pendiente",
    email: "pedro.martinez@corbeta.com",
    phone: "3119876543",
    manager: "Ana Ruiz",
    zone: "Medellín",
    unit: "Antioquia Centro",
    startDate: "2023-09-01",
    scopes: [
      { code: "SC-010", description: "Aprobación descuentos línea Cómputo", limit: "10%", status: "Pendiente" },
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

function StatusBadge({ active, status }: { active: boolean; status?: "Activo" | "Inactivo" | "Pendiente" }) {
  const resolved = status ?? (active ? "Activo" : "Inactivo");
  const styles =
    resolved === "Activo"
      ? "bg-success/20 text-success-foreground"
      : resolved === "Pendiente"
        ? "bg-amber-100 text-amber-800"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${styles}`}>
      {resolved}
    </span>
  );
}

function PillBadge({ label, tone = "warning" }: { label: string; tone?: "warning" | "success" | "muted" | "destructive" }) {
  const styles =
    tone === "success"
      ? "bg-success/20 text-success-foreground"
      : tone === "muted"
      ? "bg-muted text-muted-foreground"
      : tone === "destructive"
      ? "bg-destructive/10 text-destructive"
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
          <div key={r.label} className="grid grid-cols-2 gap-3 text-sm min-w-0">
            <dt className="text-muted-foreground min-w-0 break-words">{r.label}</dt>
            <dd className="font-medium min-w-0 break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type ScopeDecision = "approve" | "reject" | "modify" | "cancel";
type ScopeStatusLocal = "Activo" | "Pendiente" | "Espera proveedor" | "Rechazada" | "Cancelada" | "Modificada";

function ScopeActionCard({
  scope,
}: {
  scope: { code: string; description: string; limit: string; status: "Activo" | "Pendiente" };
}) {
  const [status, setStatus] = useState<ScopeStatusLocal>(scope.status);
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<ScopeDecision | null>(null);
  const [justif, setJustif] = useState("");
  const [tipoDesc, setTipoDesc] = useState("Visible");
  const [tipoExcl, setTipoExcl] = useState("No mutuamente excluyente");
  const [files, setFiles] = useState<{ name: string; size: string; by: string; date: string; status: "Validado" | "Pendiente" }[]>([
    { name: "Aprobacion_Castrol.msg", size: "1.2 MB", by: "Ana Carolina", date: "28/05/2024 09:15 a. m.", status: "Validado" },
    { name: "Correo_Proveedor.eml", size: "842 KB", by: "Ana Carolina", date: "28/05/2024 09:16 a. m.", status: "Validado" },
    { name: "Soporte_Comercial.msg", size: "2.1 MB", by: "Ana Carolina", date: "28/05/2024 09:18 a. m.", status: "Validado" },
  ]);

  const isPending = status === "Pendiente";
  const canConfirm = decision !== null && justif.trim().length > 0;

  const tone: "success" | "warning" | "destructive" | "muted" =
    status === "Activo"
      ? "success"
      : status === "Pendiente"
        ? "warning"
        : status === "Rechazada" || status === "Cancelada"
          ? "destructive"
          : "muted";

  const actions: { key: ScopeDecision; label: string; icon: any; next: ScopeStatusLocal }[] = [
    { key: "approve", label: "Aprobar", icon: Check, next: "Activo" },
    { key: "reject", label: "Rechazar", icon: X, next: "Rechazada" },
    { key: "modify", label: "Modificar y aprobar", icon: Pencil, next: "Modificada" },
    { key: "cancel", label: "Cancelar línea", icon: Ban, next: "Cancelada" },
  ];

  const confirm = () => {
    const next = actions.find((a) => a.key === decision)?.next ?? "Activo";
    setStatus(next);
    setOpen(false);
    setDecision(null);
    setJustif("");
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-b border-border">
        <div>
          <div className="text-sm font-semibold">
            {scope.code} — {scope.description}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Alcance asociado al rol de aprobador
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PillBadge label={status} tone={tone} />
          {isPending && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent"
            >
              <Pencil className="h-3.5 w-3.5" /> Gestionar
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3 p-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Código</div>
          <div className="font-medium tabular-nums">{scope.code}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Límite de descuento</div>
          <div className="font-medium tabular-nums">{scope.limit}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Estado</div>
          <div className="font-medium">{status}</div>
        </div>
      </div>

      {open && isPending && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/30">
          <div>
            <div className="text-sm font-medium text-foreground">Acción del aprobador (HU_004)</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {actions.map((a) => {
                const Icon = a.icon;
                const active = decision === a.key;
                return (
                  <button
                    key={a.key}
                    onClick={() => setDecision(a.key)}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Justificación <span className="text-destructive">*</span>
            </label>
            <textarea
              value={justif}
              onChange={(e) => setJustif(e.target.value)}
              rows={3}
              placeholder="Ingrese la justificación de su decisión…"
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground">
                Tipo de descuento <span className="text-destructive">*</span>
              </label>
              <select
                value={tipoDesc}
                onChange={(e) => setTipoDesc(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option>Visible</option>
                <option>No visible</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">
                Tipo de exclusión <span className="text-destructive">*</span>
              </label>
              <select
                value={tipoExcl}
                onChange={(e) => setTipoExcl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option>No mutuamente excluyente</option>
                <option>Mutuamente excluyente</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="text-sm font-semibold text-foreground">Adjuntar evidencia del proveedor</h5>
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                Obligatorio
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Los soportes son obligatorios para continuar con el flujo de aprobación.
            </p>
            <label className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/[0.03] px-4 py-6 text-center cursor-pointer hover:bg-primary/[0.06] transition-colors">
              <UploadCloud className="h-7 w-7 text-primary" />
              <div className="text-sm text-foreground">Arrastre archivos aquí</div>
              <div className="text-xs text-muted-foreground">o</div>
              <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                Seleccionar archivo
              </span>
              <div className="text-[11px] text-muted-foreground mt-1">
                Formatos permitidos: .msg, .eml &nbsp;|&nbsp; Tamaño máximo por archivo: 10 MB
              </div>
              <input
                type="file"
                accept=".msg,.eml"
                multiple
                className="hidden"
                onChange={(e) => {
                  const fl = Array.from(e.target.files ?? []);
                  if (!fl.length) return;
                  const now = new Date();
                  const stamp = `${now.toLocaleDateString("es-CO")} ${now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`;
                  setFiles((prev) => [
                    ...prev,
                    ...fl.map((f) => ({
                      name: f.name,
                      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
                      by: "Usuario actual",
                      date: stamp,
                      status: "Pendiente" as const,
                    })),
                  ]);
                }}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold mb-2">Archivos adjuntos ({files.length})</div>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="text-left font-medium px-3 py-2">Archivo</th>
                        <th className="text-left font-medium px-3 py-2">Subido por</th>
                        <th className="text-left font-medium px-3 py-2">Fecha y hora</th>
                        <th className="text-left font-medium px-3 py-2">Estado</th>
                        <th className="text-right font-medium px-3 py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((f, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="rounded-md bg-primary/10 p-1.5">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{f.name}</div>
                                <div className="text-[11px] text-muted-foreground">{f.size}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-foreground">{f.by}</td>
                          <td className="px-3 py-2 text-muted-foreground tabular-nums">{f.date}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                f.status === "Validado"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              <Check className="h-3 w-3" /> {f.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <button className="rounded-md border border-border bg-background p-1.5 hover:bg-accent" title="Ver">
                                <Eye className="h-3.5 w-3.5 text-primary" />
                              </button>
                              <button className="rounded-md border border-border bg-background p-1.5 hover:bg-accent" title="Descargar">
                                <Download className="h-3.5 w-3.5 text-primary" />
                              </button>
                              <button
                                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                className="rounded-md border border-border bg-background p-1.5 hover:bg-destructive/10"
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  ⓘ Puede adjuntar múltiples archivos. Los archivos serán validados automáticamente.
                </p>
              </div>
            )}
          </div>

          <button
            disabled={!canConfirm}
            onClick={confirm}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar gestión
          </button>
        </div>
      )}
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
                  <ScopeActionCard key={s.code} scope={s} />
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
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Parametrización del Flujo</h2>
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
                    <td className="px-3 py-3.5"><StatusBadge active={a.active} status={a.status} /></td>
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
