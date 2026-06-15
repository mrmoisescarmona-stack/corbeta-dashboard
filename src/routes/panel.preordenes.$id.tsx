import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Pencil,
  Ban,
  UploadCloud,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Building2,
  Phone,
  FileText,
  X,
  History,
  Mail,
  Eye,
  Download,
  Trash2,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/panel/preordenes/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Solicitud ${params.id} · Corbeta` }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    const from = search.from;
    return {
      from:
        from === "reportes" || from === "panel" || from === "preordenes"
          ? (from as "reportes" | "panel" | "preordenes")
          : undefined,
      status: typeof search.status === "string" ? (search.status as string) : undefined,
    };
  },
  component: RequestDetailPage,
});

type LineStatus = "Pendiente" | "Aprobada" | "Rechazada" | "Modificada" | "Cancelada" | "No aplica";

type Line = {
  ean: string;
  description: string;
  qty: number;
  listPrice: number;
  pctCorbeta: number | null;
  pctProveedor: number | null;
  requiresMyAction: boolean;
  status: LineStatus;
  authorizedPct?: number;
  reason?: string;
};

type TraceEntry = {
  at: string;
  who: string;
  action: string;
  detail?: string;
};

const initialLines: Line[] = [
  { ean: "7702011001234", description: "Aceite Castrol GTX 20W50 x 1 Gal", qty: 24, listPrice: 78500, pctCorbeta: 8, pctProveedor: 4, requiresMyAction: true, status: "Pendiente" },
  { ean: "7702011002345", description: "Filtro de aceite Mann W 712/75", qty: 60, listPrice: 22300, pctCorbeta: null, pctProveedor: 12, requiresMyAction: true, status: "Pendiente" },
  { ean: "7702011003456", description: "Bujía NGK BPR6ES", qty: 120, listPrice: 9800, pctCorbeta: 5, pctProveedor: null, requiresMyAction: true, status: "Pendiente" },
  { ean: "7702011004567", description: "Refrigerante Prestone 50/50 x 1 Gal", qty: 36, listPrice: 41200, pctCorbeta: 6, pctProveedor: 6, requiresMyAction: true, status: "Pendiente" },
];

const fmtCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const allowedExt = [".eml", ".msg", ".oft", ".emlx"];
const maxBytes = 10 * 1024 * 1024;

function RequestDetailPage() {
  const { id } = Route.useParams();
  const { from, status } = Route.useSearch();
  const nonEditableStatuses = ["Aprobada", "Rechazada", "Enviada a PeopleSoft", "Cancelada"];
  const readOnly = from === "reportes" || (!!status && nonEditableStatuses.includes(status));
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [trace, setTrace] = useState<TraceEntry[]>([
    { at: "28/05/2026 09:12", who: "CorbeMóvil", action: "Preorden recibida" },
    { at: "28/05/2026 09:12", who: "Sistema", action: "Asignada a Moises Carmona" },
  ]);
  const [modal, setModal] = useState<{ kind: "modify" | "reject" | "cancel"; idx: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  type Attachment = { name: string; size: string; by: string; date: string; status: "Validado" | "Pendiente" };
  const [attachments, setAttachments] = useState<Attachment[]>([
    { name: "Aprobacion_Castrol.msg", size: "1.2 MB", by: "Ana Carolina", date: "28/05/2024 09:15 a. m.", status: "Validado" },
    { name: "Correo_Proveedor.eml", size: "842 KB", by: "Ana Carolina", date: "28/05/2024 09:16 a. m.", status: "Validado" },
    { name: "Soporte_Comercial.msg", size: "2.1 MB", by: "Ana Carolina", date: "28/05/2024 09:18 a. m.", status: "Validado" },
  ]);

  const visibleLines = lines; // HU_004: solo líneas de mi gestión (mock: todas)
  const summary = useMemo(() => {
    const total = visibleLines.reduce((acc, l) => acc + l.qty * l.listPrice, 0);
    const pending = visibleLines.filter((l) => l.status === "Pendiente").length;
    return { total, pending, count: visibleLines.length };
  }, [visibleLines]);

  function pushTrace(action: string, detail?: string) {
    setTrace((t) => [
      { at: new Date().toLocaleString("es-CO"), who: "Moises Carmona", action, detail },
      ...t,
    ]);
  }

  function approve(idx: number) {
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, status: "Aprobada", requiresMyAction: false } : l)));
    pushTrace(`Aprobada línea ${lines[idx].ean}`);
  }

  function applyModify(idx: number, pct: number) {
    setLines((ls) =>
      ls.map((l, i) => (i === idx ? { ...l, status: "Modificada", authorizedPct: pct, requiresMyAction: false } : l))
    );
    pushTrace(`Modificada línea ${lines[idx].ean}`, `% autorizado: ${pct}`);
  }

  function applyReject(idx: number, reason: string) {
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, status: "Rechazada", reason, requiresMyAction: false } : l)));
    pushTrace(`Rechazada línea ${lines[idx].ean}`, `Motivo: ${reason}`);
  }

  function applyCancel(idx: number, reason: string) {
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, status: "Cancelada", reason, requiresMyAction: false } : l)));
    pushTrace(`Cancelada línea ${lines[idx].ean}`, `Motivo: ${reason}`);
  }

  function handleFiles(picked: FileList | File[]) {
    setFileError(null);
    const arr = Array.from(picked);
    for (const f of arr) {
      const lower = f.name.toLowerCase();
      if (!allowedExt.some((e) => lower.endsWith(e))) {
        setFileError(`Formato no permitido: ${f.name}. Solo se permiten ${allowedExt.join(", ")}.`);
        return;
      }
      if (f.size > maxBytes) {
        setFileError(`Archivo supera 10 MB: ${f.name}.`);
        return;
      }
    }
    const now = new Date();
    const stamp = `${now.toLocaleDateString("es-CO")} ${now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`;
    setAttachments((prev) => [
      ...prev,
      ...arr.map<Attachment>((f) => ({
        name: f.name,
        size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
        by: "Moises Carmona",
        date: stamp,
        status: "Pendiente",
      })),
    ]);
    pushTrace(`Cargó ${arr.length} soporte(s)`, arr.map((f) => f.name).join(", "));
    toast.success(
      arr.length === 1
        ? `Archivo adjuntado: ${arr[0].name}`
        : `${arr.length} archivos adjuntados correctamente`
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate({ to: readOnly ? "/panel/reportes" : "/panel/preordenes" })}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {readOnly ? "Volver a Reportes" : "Volver a Preórdenes"}
          </button>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${readOnly ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
            {readOnly ? "Solo lectura" : "Detalle"}
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Preorden {id}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Evalúa cada línea con descuento puntual. Si <span className="font-medium">% asumido por proveedor &gt; 0</span> se notifica al proveedor en paralelo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning">
            <Clock className="h-3.5 w-3.5" /> Vence en 4h 12m
          </span>
        </div>
      </div>

      {/* Preorden meta */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">
          <MetaItem icon={User} label="Cliente" value="Distribuidora del Valle" sub="NIT 900.123.456-7 · Canal Mayorista" />
          <MetaItem icon={MapPin} label="Zona / Unidad" value="Occidente" sub="Cali · Sede Norte" />
          <MetaItem icon={Building2} label="Proveedor" value="Castrol" sub="Categoría Lubricantes" />
          <MetaItem icon={Phone} label="Vendedor" value="Luis Quintero" sub="+57 318 555 1024" />
        </div>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-xs text-muted-foreground">
          <div><span className="text-foreground/70 font-medium">Digitada:</span> 28/05/2026 09:08</div>
          <div><span className="text-foreground/70 font-medium">Recibida:</span> 28/05/2026 09:12</div>
          <div><span className="text-foreground/70 font-medium">Origen:</span> CorbeMóvil (100)</div>
          <div><span className="text-foreground/70 font-medium">Catálogo:</span> Lubricantes 2026</div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Líneas asignadas" value={summary.count} />
        <StatCard label="Pendientes por gestionar" value={summary.pending} tone="warning" />
        <StatCard label="Valor preorden" value={fmtCOP(summary.total)} />
      </section>

      {/* Líneas */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold">Productos con descuento puntual</h3>
          </div>
          <span className="text-xs text-muted-foreground">Solo se muestran las líneas que requieren tu gestión</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-5 py-3">EAN / Producto</th>
                <th className="font-medium px-3 py-3 text-right">Cant.</th>
                <th className="font-medium px-3 py-3 text-right">Precio lista</th>
                <th className="font-medium px-3 py-3 text-right">% Corbeta</th>
                <th className="font-medium px-3 py-3 text-right">% Proveedor</th>
                <th className="font-medium px-3 py-3">Estado</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map((l, idx) => {
                const done = l.status !== "Pendiente";
                return (
                  <tr key={l.ean} className="border-t border-border align-top hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{l.description}</div>
                      <div className="text-[11px] text-muted-foreground tabular-nums">EAN {l.ean}</div>
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{l.qty}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{fmtCOP(l.listPrice)}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{l.pctCorbeta ?? "—"}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{l.pctProveedor ?? "—"}</td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={l.status} />
                      {l.authorizedPct != null && (
                        <div className="mt-1 text-[11px] text-muted-foreground">% autorizado: {l.authorizedPct}</div>
                      )}
                      {l.reason && (
                        <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{l.reason}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <ActionBtn label="Aprobar" icon={CheckCircle2} tone="success" disabled={done || readOnly} onClick={() => approve(idx)} />
                        <ActionBtn label="Modificar" icon={Pencil} disabled={done || readOnly} onClick={() => setModal({ kind: "modify", idx })} />
                        <ActionBtn label="Rechazar" icon={XCircle} tone="destructive" disabled={done || readOnly} onClick={() => setModal({ kind: "reject", idx })} />
                        <ActionBtn label="Cancelar" icon={Ban} disabled={done || readOnly} onClick={() => setModal({ kind: "cancel", idx })} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soportes */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">Adjuntar evidencia del proveedor</h3>
          <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
            Obligatorio
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Los soportes son obligatorios para continuar con el flujo de aprobación.
        </p>

        {!readOnly && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInput.current?.click()}
          className={`mt-4 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-primary/30 bg-primary/[0.04] hover:bg-primary/[0.08]"
          }`}
        >
          <UploadCloud className="mx-auto h-9 w-9 text-primary" />
          <div className="mt-2 text-sm text-foreground">Arrastre archivos aquí</div>
          <div className="text-xs text-muted-foreground mt-1">o</div>
          <span className="mt-2 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground">
            Seleccionar archivo
          </span>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Formatos permitidos: .eml, .msg, .oft, .emlx &nbsp;|&nbsp; Tamaño máximo por archivo: 10 MB
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".eml,.msg,.oft,.emlx"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
        )}

        {fileError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {fileError}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-semibold mb-2">Archivos adjuntos ({attachments.length})</div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Archivo</th>
                    <th className="text-left font-medium px-3 py-2">Subido por</th>
                    <th className="text-left font-medium px-3 py-2">Fecha y hora</th>
                    <th className="text-left font-medium px-3 py-2">Estado</th>
                    <th className="text-right font-medium px-3 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((f, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2.5">
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
                      <td className="px-3 py-2.5 text-foreground">{f.by}</td>
                      <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{f.date}</td>
                      <td className="px-3 py-2.5">
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
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="rounded-md border border-border bg-background p-1.5 hover:bg-accent" title="Ver">
                            <Eye className="h-3.5 w-3.5 text-primary" />
                          </button>
                          <button className="rounded-md border border-border bg-background p-1.5 hover:bg-accent" title="Descargar">
                            <Download className="h-3.5 w-3.5 text-primary" />
                          </button>
                          {!readOnly && (
                          <button
                            onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                            className="rounded-md border border-border bg-background p-1.5 hover:bg-destructive/10"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                          )}
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

      {/* Trazabilidad */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold">Trazabilidad</h3>
        </div>
        <ol className="mt-4 space-y-3">
          {trace.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{t.action}</div>
                {t.detail && <div className="text-xs text-muted-foreground">{t.detail}</div>}
                <div className="text-[11px] text-muted-foreground">{t.at} · {t.who}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {modal && (
        <DecisionModal
          kind={modal.kind}
          line={lines[modal.idx]}
          onClose={() => setModal(null)}
          onModify={(pct) => {
            applyModify(modal.idx, pct);
            setModal(null);
          }}
          onReject={(reason) => {
            applyReject(modal.idx, reason);
            setModal(null);
          }}
          onCancel={(reason) => {
            applyCancel(modal.idx, reason);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function MetaItem({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium truncate">{value}</div>
        {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: "warning" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${tone === "warning" ? "text-warning" : ""}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: LineStatus }) {
  const map: Record<LineStatus, string> = {
    Pendiente: "bg-primary/10 text-primary",
    Aprobada: "bg-success/20 text-foreground",
    Rechazada: "bg-destructive/10 text-destructive",
    Modificada: "bg-warning/10 text-warning",
    Cancelada: "bg-muted text-muted-foreground",
    "No aplica": "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function ActionBtn({
  label,
  icon: Icon,
  onClick,
  disabled,
  tone,
}: {
  label: string;
  icon: any;
  onClick: () => void;
  disabled?: boolean;
  tone?: "success" | "destructive";
}) {
  const toneCls =
    tone === "success"
      ? "hover:bg-success/15 hover:text-foreground"
      : tone === "destructive"
        ? "hover:bg-destructive/10 hover:text-destructive"
        : "hover:bg-accent";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${toneCls}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function DecisionModal({
  kind,
  line,
  onClose,
  onModify,
  onReject,
  onCancel,
}: {
  kind: "modify" | "reject" | "cancel";
  line: Line;
  onClose: () => void;
  onModify: (pct: number) => void;
  onReject: (reason: string) => void;
  onCancel: (reason: string) => void;
}) {
  const [pct, setPct] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  const titles = {
    modify: "Modificar porcentaje",
    reject: "Rechazar línea",
    cancel: "Cancelar línea",
  } as const;

  function submit() {
    setErr(null);
    if (kind === "modify") {
      if (!/^\d{1,3}(\.\d)?$/.test(pct)) {
        setErr("Ingresa un valor entre 0 y 100 con máximo un decimal.");
        return;
      }
      const n = Number(pct);
      if (!(n >= 0 && n <= 100)) {
        setErr("El porcentaje debe estar entre 0 y 100.");
        return;
      }
      onModify(n);
    } else if (kind === "reject") {
      if (reason.trim().length < 5) {
        setErr("La justificación es obligatoria (mínimo 5 caracteres).");
        return;
      }
      onReject(reason.trim());
    } else {
      if (reason.trim().length < 5) {
        setErr("Indica el motivo de la cancelación.");
        return;
      }
      onCancel(reason.trim());
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold">{titles[kind]}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{line.description}</p>
          </div>
          <button className="rounded-md p-1 text-muted-foreground hover:bg-accent" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {kind === "modify" ? (
            <div>
              <label className="text-xs font-medium">Porcentaje autorizado</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={pct}
                  onChange={(e) => setPct(e.target.value)}
                  placeholder="Ej. 7.5"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Valor entre 0 y 100, máximo un decimal.</p>
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium">{kind === "reject" ? "Justificación" : "Motivo"}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Describe el motivo…"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}

          {err && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {err}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium hover:bg-accent">
            Cancelar
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// Suppress unused import warning when Link is not needed; keep available for future row links
void Link;
