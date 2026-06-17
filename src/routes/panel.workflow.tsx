import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeftRight, Check, X, Ban, UploadCloud, Mail, Phone, Eye, Download, Search } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/panel/workflow")({
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

const DIRECTION_DIVISIONS: Record<string, string[]> = {
  "Electrodomésticos": ["Línea Blanca", "Cocción"],
  "Tecnología": ["Computación", "Móvil"],
  "Hogar": ["Cocina"],
};
const DIRECTIONS = Object.keys(DIRECTION_DIVISIONS);

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  disabled,
  placeholder = "Seleccionar…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} <span className="text-destructive">*</span>
      </label>
      <select
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${error ? "border-destructive" : "border-border"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

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

type Substitute = { approver: string; substitute: string; start: string; end: string };

const substitutes: Substitute[] = [
  { approver: "Laura Sánchez", substitute: "María González", start: "2026-06-01", end: "2026-06-30" },
];

type Provider = {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  active: boolean;
};

const PROVIDER_CATEGORIES = ["Electrodomésticos", "Tecnología", "Hogar", "Línea Blanca", "Lubricantes"];

const providers: Provider[] = [
  { id: "900123456", name: "Samsung Colombia S.A.", category: "Electrodomésticos", email: "aprobaciones@samsung.com.co", phone: "+57 601 5953000", active: true },
  { id: "900654321", name: "LG Electronics", category: "Tecnología", email: "descuentos@lg.com.co", phone: "+57 601 4327100", active: true },
  { id: "900789012", name: "Whirlpool Andina", category: "Línea Blanca", email: "comercial@whirlpool.com.co", phone: "+57 601 6512200", active: true },
];

type CategoryApprover = {
  approver: string;
  identification: string;
  groupCode: string;
  direction: string;
  divisionCode: string;
  subdirection: string;
  lineCode: string;
  line: string;
  sublineCode: string;
  sublineName: string;
  categoryCode: string;
  categoryName: string;
  subcategoryCode: string;
  subcategoryName: string;
  familyCode: string;
  familyName: string;
  active: boolean;
};

const initialCategoryApprovers: CategoryApprover[] = [
  { approver: "María González", identification: "52123456", groupCode: "GRP-01", direction: "Electrodomésticos", divisionCode: "DIV-10", subdirection: "Línea Blanca", lineCode: "LIN-01", line: "Refrigeración", sublineCode: "SUB-01", sublineName: "Neveras No Frost", categoryCode: "CAT-01", categoryName: "Neveras", subcategoryCode: "SCAT-01", subcategoryName: "Side by Side", familyCode: "FAM-01", familyName: "Neveras Samsung", active: true },
  { approver: "Pedro Martínez", identification: "79123456", groupCode: "GRP-02", direction: "Tecnología", divisionCode: "DIV-20", subdirection: "Audio y Video", lineCode: "LIN-10", line: "Televisores", sublineCode: "SUB-10", sublineName: "Smart TV", categoryCode: "CAT-10", categoryName: "Televisores premium", subcategoryCode: "SCAT-10", subcategoryName: "OLED 4K", familyCode: "FAM-10", familyName: "LG OLED", active: true },
  { approver: "María González", identification: "52123456", groupCode: "GRP-01", direction: "Electrodomésticos", divisionCode: "DIV-10", subdirection: "Línea Blanca", lineCode: "LIN-02", line: "Lavado", sublineCode: "SUB-02", sublineName: "Lavadoras carga frontal", categoryCode: "CAT-02", categoryName: "Lavadoras automáticas", subcategoryCode: "SCAT-02", subcategoryName: "Inverter", familyCode: "FAM-02", familyName: "Lavadoras Samsung", active: true },
  { approver: "María González", identification: "52123456", groupCode: "GRP-02", direction: "Tecnología", divisionCode: "DIV-21", subdirection: "Cómputo móvil", lineCode: "LIN-20", line: "Tablets", sublineCode: "SUB-20", sublineName: "Tablets Android", categoryCode: "CAT-20", categoryName: "Tablets", subcategoryCode: "SCAT-20", subcategoryName: "10 pulgadas", familyCode: "FAM-20", familyName: "Samsung Galaxy Tab", active: true },
  { approver: "Pedro Martínez", identification: "79123456", groupCode: "GRP-02", direction: "Tecnología", divisionCode: "DIV-21", subdirection: "Cómputo móvil", lineCode: "LIN-20", line: "Tablets", sublineCode: "SUB-20", sublineName: "Tablets Android", categoryCode: "CAT-20", categoryName: "Tablets", subcategoryCode: "SCAT-21", subcategoryName: "11 pulgadas", familyCode: "FAM-21", familyName: "Samsung Galaxy Tab", active: true },
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

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
      {children}
    </button>
  );
}

function NewApproverDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", id: "", email: "", direction: "", division: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!form.id.trim()) e.id = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!emailRegex.test(form.email.trim())) e.email = "Email inválido";
    if (!form.direction.trim()) e.direction = "Requerido";
    if (!form.division.trim()) e.division = "Requerido";
    setErrors(e);
    if (Object.keys(e).length) return;
    toast.success("Aprobador guardado");
    setForm({ name: "", id: "", email: "", direction: "", division: "" });
    onClose();
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(ev) => setForm({ ...form, [key]: ev.target.value })}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors[key] ? "border-destructive" : "border-border"}`}
        maxLength={key === "email" ? 255 : 100}
      />
      {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo aprobador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {field("name", "Nombre")}
          {field("id", "Identificación")}
          {field("email", "Email", "email")}
          <SelectField
            label="Dirección"
            value={form.direction}
            onChange={(v) => setForm({ ...form, direction: v, division: "" })}
            options={DIRECTIONS}
            error={errors.direction}
          />
          <SelectField
            label="División"
            value={form.division}
            onChange={(v) => setForm({ ...form, division: v })}
            options={form.direction ? DIRECTION_DIVISIONS[form.direction] ?? [] : []}
            error={errors.division}
            disabled={!form.direction}
            placeholder={form.direction ? "Seleccionar…" : "Seleccione una dirección primero"}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button onClick={submit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Guardar</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditApproverDialog({
  approver,
  onClose,
  onSave,
}: {
  approver: Approver | null;
  onClose: () => void;
  onSave: (updated: Approver) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    id: "",
    email: "",
    direction: "",
    division: "",
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (approver) {
      setForm({
        name: approver.name,
        id: approver.id,
        email: approver.email,
        direction: approver.direction,
        division: approver.division,
        active: approver.active,
      });
      setErrors({});
    }
  }, [approver]);

  const submit = () => {
    if (!approver) return;
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!form.id.trim()) e.id = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!emailRegex.test(form.email.trim())) e.email = "Email inválido";
    if (!form.direction.trim()) e.direction = "Requerido";
    if (!form.division.trim()) e.division = "Requerido";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      ...approver,
      name: form.name.trim(),
      id: form.id.trim(),
      email: form.email.trim(),
      direction: form.direction.trim(),
      division: form.division.trim(),
      active: form.active,
      status: form.active ? "Activo" : "Inactivo",
    });
  };

  const field = (key: "name" | "id" | "email" | "direction" | "division", label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(ev) => setForm({ ...form, [key]: ev.target.value })}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors[key] ? "border-destructive" : "border-border"}`}
        maxLength={key === "email" ? 255 : 100}
      />
      {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={!!approver} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar aprobador</DialogTitle>
          <DialogDescription>Actualice la información del aprobador.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {field("name", "Nombre")}
          {field("id", "Identificación")}
          {field("email", "Email", "email")}
          <SelectField
            label="Dirección"
            value={form.direction}
            onChange={(v) => setForm({ ...form, direction: v, division: "" })}
            options={DIRECTIONS}
            error={errors.direction}
          />
          <SelectField
            label="División"
            value={form.division}
            onChange={(v) => setForm({ ...form, division: v })}
            options={form.direction ? DIRECTION_DIVISIONS[form.direction] ?? [] : []}
            error={errors.division}
            disabled={!form.direction}
            placeholder={form.direction ? "Seleccionar…" : "Seleccione una dirección primero"}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(ev) => setForm({ ...form, active: ev.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Activo
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button onClick={submit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Guardar cambios</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteApproverDialog({
  approver,
  onClose,
  onConfirm,
}: {
  approver: Approver | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={!!approver} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar aprobador</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar a{" "}
            <span className="font-medium text-foreground">{approver?.name}</span>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button onClick={onConfirm} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">Eliminar</button>
        </div>
      </DialogContent>
    </Dialog>
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
              Los soportes son obligatorios para continuar con el workflow de aprobación.
            </p>
            <FileDropzone
              onFiles={(fl) => {
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
                toast.success(
                  fl.length === 1
                    ? `Archivo adjuntado: ${fl[0].name}`
                    : `${fl.length} archivos adjuntados correctamente`
                );
              }}
            />

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

const APPROVER_OPTIONS = [
  { name: "María González", id: "52123456" },
  { name: "Pedro Martínez", id: "79123456" },
  { name: "Laura Sánchez", id: "35123456" },
];

const emptyCategoryApprover: CategoryApprover = {
  approver: "",
  identification: "",
  groupCode: "",
  direction: "",
  divisionCode: "",
  subdirection: "",
  lineCode: "",
  line: "",
  sublineCode: "",
  sublineName: "",
  categoryCode: "",
  categoryName: "",
  subcategoryCode: "",
  subcategoryName: "",
  familyCode: "",
  familyName: "",
  active: true,
};

function CategoryConfigDialog({
  open,
  initial,
  mode,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: CategoryApprover | null;
  mode: "create" | "edit";
  onClose: () => void;
  onSave: (row: CategoryApprover) => void;
}) {
  const [form, setForm] = useState<CategoryApprover>(emptyCategoryApprover);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyCategoryApprover);
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof CategoryApprover>(key: K, value: CategoryApprover[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const requiredKeys: (keyof CategoryApprover)[] = [
    "approver", "groupCode", "direction", "divisionCode", "subdirection",
    "lineCode", "line", "sublineCode", "sublineName",
    "categoryCode", "categoryName", "subcategoryCode", "subcategoryName",
    "familyCode", "familyName",
  ];

  const submit = () => {
    const e: Record<string, string> = {};
    for (const k of requiredKeys) {
      const v = form[k];
      if (typeof v === "string" && !v.trim()) e[k] = "Requerido";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
  };

  const field = (key: keyof CategoryApprover, label: string) => (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        type="text"
        value={form[key] as string}
        onChange={(ev) => set(key, ev.target.value as any)}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors[key] ? "border-destructive" : "border-border"}`}
        maxLength={100}
      />
      {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nueva configuración por categoría" : "Editar configuración por categoría"}
          </DialogTitle>
          <DialogDescription>
            Asignación del aprobador interno según el árbol de categorías del producto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Aprobador interno <span className="text-destructive">*</span>
            </label>
            <select
              value={form.approver}
              onChange={(ev) => {
                const opt = APPROVER_OPTIONS.find((o) => o.name === ev.target.value);
                setForm((prev) => ({
                  ...prev,
                  approver: ev.target.value,
                  identification: opt?.id ?? prev.identification,
                }));
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.approver ? "border-destructive" : "border-border"}`}
            >
              <option value="">Seleccionar…</option>
              {APPROVER_OPTIONS.map((o) => (
                <option key={o.id} value={o.name}>{o.name} — {o.id}</option>
              ))}
            </select>
            {errors.approver && <p className="mt-1 text-xs text-destructive">{errors.approver}</p>}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categorías del artículo</h4>

            <div>
              <h5 className="text-sm font-medium mb-3">Grupo y dirección</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field("groupCode", "Código Grupo")}
                {field("direction", "Dirección")}
                {field("divisionCode", "Código de División")}
                {field("subdirection", "Subdirección")}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-3">Línea y sublínea</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field("lineCode", "Código Línea")}
                {field("line", "Línea")}
                {field("sublineCode", "Código Sublínea")}
                {field("sublineName", "Nombre de la Sublínea")}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-3">Categoría y subcategoría</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field("categoryCode", "Categoría")}
                {field("categoryName", "Nombre de la Categoría")}
                {field("subcategoryCode", "Código de Subcategoría")}
                {field("subcategoryName", "Nombre de la Subcategoría")}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-3">Familia</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field("familyCode", "Familia")}
                {field("familyName", "Nombre de la Familia")}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(ev) => set("active", ev.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Configuración activa
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button onClick={submit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            {mode === "create" ? "Guardar configuración" : "Guardar cambios"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryViewDialog({ row, onClose }: { row: CategoryApprover | null; onClose: () => void }) {
  const rows: { label: string; value: string }[] = row
    ? [
        { label: "Aprobador", value: row.approver },
        { label: "Identificación", value: row.identification },
        { label: "Código Grupo", value: row.groupCode },
        { label: "Dirección", value: row.direction },
        { label: "Código de División", value: row.divisionCode },
        { label: "Subdirección", value: row.subdirection },
        { label: "Código Línea", value: row.lineCode },
        { label: "Línea", value: row.line },
        { label: "Código Sublínea", value: row.sublineCode },
        { label: "Nombre de la Sublínea", value: row.sublineName },
        { label: "Categoría", value: row.categoryCode },
        { label: "Nombre de la Categoría", value: row.categoryName },
        { label: "Código de Subcategoría", value: row.subcategoryCode },
        { label: "Nombre de la Subcategoría", value: row.subcategoryName },
        { label: "Familia", value: row.familyCode },
        { label: "Nombre de la Familia", value: row.familyName },
        { label: "Estado", value: row.active ? "Activo" : "Inactivo" },
      ]
    : [];

  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de configuración por categoría</DialogTitle>
          <DialogDescription>Información completa de la asignación.</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 py-2">
          {rows.map((r) => (
            <div key={r.label} className="border-b border-border pb-2">
              <dt className="text-xs text-muted-foreground">{r.label}</dt>
              <dd className="text-sm font-medium">{r.value || "—"}</dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cerrar</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDeleteDialog({
  row,
  onClose,
  onConfirm,
}: {
  row: CategoryApprover | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar configuración</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar la configuración de{" "}
            <span className="font-medium text-foreground">{row?.approver}</span> para{" "}
            <span className="font-medium text-foreground">{row?.categoryName}</span>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button onClick={onConfirm} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">Eliminar</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryApproversCard() {
  const [list, setList] = useState<CategoryApprover[]>(initialCategoryApprovers);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryApprover | null>(null);
  const [viewing, setViewing] = useState<CategoryApprover | null>(null);
  const [deleting, setDeleting] = useState<CategoryApprover | null>(null);

  const q = query.trim().toLowerCase();
  const rows = q
    ? list.filter((r) =>
        [r.approver, r.identification, r.groupCode, r.categoryName, r.familyName, r.line]
          .some((v) => v.toLowerCase().includes(q))
      )
    : list;

  const handleCreate = (row: CategoryApprover) => {
    setList((prev) => [...prev, row]);
    toast.success("Configuración creada");
    setCreateOpen(false);
  };

  const handleEdit = (row: CategoryApprover) => {
    if (!editing) return;
    setList((prev) => prev.map((r) => (r === editing ? row : r)));
    toast.success("Configuración actualizada");
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setList((prev) => prev.filter((r) => r !== deleting));
    toast.success("Configuración eliminada");
    setDeleting(null);
  };

  return (
    <SectionCard
      title="Aprobadores por categorías de artículos"
      subtitle="Asignación de aprobadores internos según el árbol de categorías del producto (HU_002)"
      action={
        <PrimaryButton onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Nueva configuración
        </PrimaryButton>
      }
    >
      <div className="p-5 pb-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por aprobador, código o nombre de categoría…"
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>
      <div className="overflow-x-auto p-5 pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="font-medium px-3 py-3">Aprobador</th>
              <th className="font-medium px-3 py-3">Identificación</th>
              <th className="font-medium px-3 py-3">Código Grupo</th>
              <th className="font-medium px-3 py-3">Dirección</th>
              <th className="font-medium px-3 py-3">Código de División</th>
              <th className="font-medium px-3 py-3">Línea</th>
              <th className="font-medium px-3 py-3">Nombre de la Categoría</th>
              <th className="font-medium px-3 py-3">Nombre de la Familia</th>
              <th className="font-medium px-3 py-3">Estado</th>
              <th className="font-medium px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/40">
                <td className="px-3 py-3.5 font-medium">{r.approver}</td>
                <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{r.identification}</td>
                <td className="px-3 py-3.5">{r.groupCode}</td>
                <td className="px-3 py-3.5">{r.direction}</td>
                <td className="px-3 py-3.5 tabular-nums">{r.divisionCode}</td>
                <td className="px-3 py-3.5">{r.line}</td>
                <td className="px-3 py-3.5">{r.categoryName}</td>
                <td className="px-3 py-3.5">{r.familyName}</td>
                <td className="px-3 py-3.5"><StatusBadge active={r.active} /></td>
                <td className="px-3 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setViewing(r)} className="rounded-md p-1.5 hover:bg-accent" aria-label="Ver" title="Ver"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setEditing(r)} className="rounded-md p-1.5 hover:bg-accent" aria-label="Editar" title="Editar"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(r)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" aria-label="Eliminar" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Sin resultados para "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryConfigDialog
        open={createOpen}
        initial={null}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
      <CategoryConfigDialog
        open={!!editing}
        initial={editing}
        mode="edit"
        onClose={() => setEditing(null)}
        onSave={handleEdit}
      />
      <CategoryViewDialog row={viewing} onClose={() => setViewing(null)} />
      <CategoryDeleteDialog row={deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
    </SectionCard>
  );
}


function ApprovalsPage() {
  const [tab, setTab] = useState<TabKey>("aprobadores");
  const [selected, setSelected] = useState<Approver | null>(null);
  const [newApproverOpen, setNewApproverOpen] = useState(false);
  const [list, setList] = useState<Approver[]>(approvers);
  const [editing, setEditing] = useState<Approver | null>(null);
  const [deleting, setDeleting] = useState<Approver | null>(null);
  const [providerList, setProviderList] = useState<Provider[]>(providers);
  const [newProviderOpen, setNewProviderOpen] = useState(false);
  const [previewProvider, setPreviewProvider] = useState<Provider | null>(null);
  const [substituteList, setSubstituteList] = useState<Substitute[]>(substitutes);
  const [substituteDialog, setSubstituteDialog] = useState<{ open: boolean; editIndex: number | null }>({ open: false, editIndex: null });
  const [deletingSubstitute, setDeletingSubstitute] = useState<{ index: number; item: Substitute } | null>(null);
  if (useFakeLoading()) return <ApprovalsSkeleton />;

  const confirmDelete = () => {
    if (!deleting) return;
    setList((prev) => prev.filter((a) => a.id !== deleting.id));
    toast.success(`Aprobador "${deleting.name}" eliminado`);
    setDeleting(null);
  };

  const saveEdit = (updated: Approver) => {
    setList((prev) => prev.map((a) => (a.id === editing?.id ? updated : a)));
    toast.success("Aprobador actualizado");
    setEditing(null);
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Parametrización del Workflow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuración de reglas, aprobadores, sustitutos y proveedores
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
        <>
        <SectionCard
          title="Aprobadores internos"
          subtitle="Configuración por dirección y división"
          action={
            <PrimaryButton onClick={() => setNewApproverOpen(true)}>
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
                {list.map((a) => (
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
                          aria-label="Ver detalles"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditing(a)}
                          className="rounded-md p-1.5 hover:bg-accent"
                          aria-label="Editar"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(a)}
                          className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </SectionCard>
        {/* <CategoryApproversCard /> — oculto temporalmente, guardado para después */}
        </>
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
            <PrimaryButton onClick={() => setNewProviderOpen(true)}>
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
                  <th className="font-medium px-3 py-3">Teléfono</th>
                  <th className="font-medium px-3 py-3">Estado</th>
                  <th className="font-medium px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {providerList.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium tabular-nums">{p.id}</td>
                    <td className="px-3 py-3.5">{p.name}</td>
                    <td className="px-3 py-3.5">{p.category}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{p.email}</td>
                    <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{p.phone}</td>
                    <td className="px-3 py-3.5"><StatusBadge active={p.active} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setPreviewProvider(p)}
                          className="rounded-md p-1.5 hover:bg-accent"
                          aria-label={`Previsualizar ${p.name}`}
                          title="Previsualizar / habilitar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={`mailto:${p.email}`}
                          className="rounded-md p-1.5 hover:bg-accent text-primary"
                          aria-label={`Enviar correo a ${p.name}`}
                          title={`Enviar correo a ${p.email}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          className="rounded-md p-1.5 hover:bg-accent text-primary"
                          aria-label={`Llamar a ${p.name}`}
                          title={`Llamar al ${p.phone}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
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

      {tab === "proveedores" && (
        <SectionCard
          title="Catálogo y desempeño"
          subtitle="Indicadores operativos por proveedor"
          action={null}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium px-5 py-3">Proveedor</th>
                  <th className="font-medium px-3 py-3">Categoría</th>
                  <th className="font-medium px-3 py-3">Estado</th>
                  <th className="font-medium px-3 py-3 text-right">Solicitudes</th>
                  <th className="font-medium px-3 py-3 text-right">Aprob. %</th>
                  <th className="font-medium px-5 py-3 text-right">Tiempo prom.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Castrol", category: "Lubricantes", status: "Activo", requests: 124, approved: 68, avg: "18.7h" },
                  { name: "Shell", category: "Lubricantes", status: "Activo", requests: 86, approved: 72, avg: "14.2h" },
                  { name: "Mobil", category: "Lubricantes", status: "Activo", requests: 54, approved: 65, avg: "21.1h" },
                  { name: "Total", category: "Lubricantes", status: "Pausado", requests: 32, approved: 58, avg: "26.4h" },
                  { name: "Valvoline", category: "Lubricantes", status: "Activo", requests: 48, approved: 70, avg: "16.9h" },
                  { name: "Repsol", category: "Lubricantes", status: "Activo", requests: 39, approved: 62, avg: "19.5h" },
                ].map((p) => (
                  <tr key={p.name} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{p.name}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{p.category}</td>
                    <td className="px-3 py-3.5"><StatusBadge active={p.status === "Activo"} /></td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{p.requests}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{p.approved}%</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{p.avg}</td>
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
      <NewApproverDialog open={newApproverOpen} onClose={() => setNewApproverOpen(false)} />
      <EditApproverDialog approver={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      <DeleteApproverDialog approver={deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />
      <NewProviderDialog
        open={newProviderOpen}
        onClose={() => setNewProviderOpen(false)}
        onSave={(p) => {
          setProviderList((prev) => [...prev, p]);
          toast.success(`Proveedor "${p.name}" agregado`);
          setNewProviderOpen(false);
        }}
      />
      <ProviderPreviewDialog
        provider={previewProvider}
        onClose={() => setPreviewProvider(null)}
        onToggle={(active) => {
          if (!previewProvider) return;
          setProviderList((prev) =>
            prev.map((p) => (p.id === previewProvider.id ? { ...p, active } : p))
          );
          setPreviewProvider((prev) => (prev ? { ...prev, active } : prev));
          toast.success(`Proveedor ${active ? "habilitado" : "deshabilitado"}`);
        }}
      />
    </div>
  );
}

const ALLOWED_EXT = [".eml", ".msg", ".oft", ".emlx"];
const MAX_BYTES = 10 * 1024 * 1024;

function FileDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragOver, setDragOver] = useState(false);

  const handle = (list: FileList | File[]) => {
    const arr = Array.from(list);
    const valid: File[] = [];
    for (const f of arr) {
      const lower = f.name.toLowerCase();
      if (!ALLOWED_EXT.some((e) => lower.endsWith(e))) {
        toast.error(`Formato no permitido: ${f.name}`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name} supera 10 MB`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) onFiles(valid);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) handle(e.dataTransfer.files);
      }}
      className={`mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
        dragOver
          ? "border-primary bg-primary/10"
          : "border-primary/30 bg-primary/[0.03] hover:bg-primary/[0.06]"
      }`}
    >
      <UploadCloud className="h-7 w-7 text-primary" />
      <div className="text-sm text-foreground">Arrastre archivos aquí</div>
      <div className="text-xs text-muted-foreground">o</div>
      <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
        Seleccionar archivo
      </span>
      <div className="text-[11px] text-muted-foreground mt-1">
        Formatos permitidos: .eml, .msg, .oft, .emlx &nbsp;|&nbsp; Tamaño máximo por archivo: 10 MB
      </div>
      <input
        type="file"
        accept=".eml,.msg,.oft,.emlx"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handle(e.target.files)}
      />
    </label>
  );
}

function NewProviderDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (p: Provider) => void;
}) {
  const empty: Provider = { id: "", name: "", category: "", email: "", phone: "", active: true };
  const [form, setForm] = useState<Provider>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Provider, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = <K extends keyof Provider>(k: K, v: Provider[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const submit = () => {
    const next: Partial<Record<keyof Provider, string>> = {};
    if (!form.id.trim()) next.id = "Requerido";
    if (!form.name.trim()) next.name = "Requerido";
    if (!form.category) next.category = "Requerido";
    if (!form.email.trim()) next.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email inválido";
    if (!form.phone.trim()) next.phone = "Requerido";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar proveedor</DialogTitle>
          <DialogDescription>Complete los datos del nuevo proveedor.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Identificación <span className="text-destructive">*</span></label>
            <input
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.id ? "border-destructive" : "border-border"}`}
              placeholder="900123456"
            />
            {errors.id && <p className="mt-1 text-xs text-destructive">{errors.id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nombre <span className="text-destructive">*</span></label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.name ? "border-destructive" : "border-border"}`}
              placeholder="Razón social"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <SelectField
            label="Categoría"
            value={form.category}
            onChange={(v) => set("category", v)}
            options={PROVIDER_CATEGORIES}
            error={errors.category}
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Email <span className="text-destructive">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.email ? "border-destructive" : "border-border"}`}
              placeholder="contacto@proveedor.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Teléfono <span className="text-destructive">*</span></label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.phone ? "border-destructive" : "border-border"}`}
              placeholder="+57 601 0000000"
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Estado</label>
            <button
              type="button"
              onClick={() => set("active", !form.active)}
              className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm w-full"
            >
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.active ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </span>
              <span>{form.active ? "Activo" : "Inactivo"}</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-background px-3.5 py-2 text-sm hover:bg-accent"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProviderPreviewDialog({
  provider,
  onClose,
  onToggle,
}: {
  provider: Provider | null;
  onClose: () => void;
  onToggle: (active: boolean) => void;
}) {
  return (
    <Dialog open={!!provider} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Previsualización de proveedor</DialogTitle>
          <DialogDescription>Revise los datos y habilite o deshabilite el proveedor.</DialogDescription>
        </DialogHeader>
        {provider && (
          <div className="space-y-3 pt-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Identificación</span>
              <span className="col-span-2 font-medium tabular-nums">{provider.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Nombre</span>
              <span className="col-span-2 font-medium">{provider.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Categoría</span>
              <span className="col-span-2">{provider.category}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Email</span>
              <span className="col-span-2">{provider.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Teléfono</span>
              <span className="col-span-2 tabular-nums">{provider.phone}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5 mt-4">
              <div>
                <div className="text-sm font-medium">Estado del proveedor</div>
                <div className="text-xs text-muted-foreground">
                  {provider.active ? "Habilitado en el catálogo" : "Deshabilitado del catálogo"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggle(!provider.active)}
                aria-label={provider.active ? "Deshabilitar" : "Habilitar"}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.active ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${provider.active ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-background px-3.5 py-2 text-sm hover:bg-accent"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
