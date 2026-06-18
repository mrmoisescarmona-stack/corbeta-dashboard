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
import { GestionModal } from "@/components/gestion-modal";

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
type ProductStatus = "Pendiente" | "En Proceso" | "Finalizado";
type ProviderStatus = "Pendiente" | "Aprobado" | "Rechazado" | "Modificado";
type ApproverStatus = "Pendiente" | "Aprobado" | "Rechazado" | "Modificado" | "Cancelada";

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
  providerStatus: ProviderStatus;
  providerPct?: number;
  approverStatus: ApproverStatus;
  approverPct?: number;
};

type TraceEntry = {
  at: string;
  who: string;
  action: string;
  detail?: string;
};

const initialLines: Line[] = [
  { ean: "7702011001234", description: "Aceite Castrol GTX 20W50 x 1 Gal", qty: 24, listPrice: 78500, pctCorbeta: 8, pctProveedor: 4, requiresMyAction: true, status: "Pendiente", providerStatus: "Aprobado", providerPct: 4, approverStatus: "Pendiente" },
  { ean: "7702011002345", description: "Filtro de aceite Mann W 712/75", qty: 60, listPrice: 22300, pctCorbeta: null, pctProveedor: 12, requiresMyAction: true, status: "Pendiente", providerStatus: "Modificado", providerPct: 10, approverStatus: "Pendiente" },
  { ean: "7702011003456", description: "Bujía NGK BPR6ES", qty: 120, listPrice: 9800, pctCorbeta: 5, pctProveedor: null, requiresMyAction: true, status: "Pendiente", providerStatus: "Rechazado", approverStatus: "Pendiente" },
  { ean: "7702011004567", description: "Refrigerante Prestone 50/50 x 1 Gal", qty: 36, listPrice: 41200, pctCorbeta: 6, pctProveedor: 6, requiresMyAction: true, status: "Pendiente", providerStatus: "Aprobado", providerPct: 6, approverStatus: "Pendiente" },
];

function deriveProductStatus(l: Line): ProductStatus {
  if (l.status !== "Pendiente") return "Finalizado";
  if (l.approverStatus === "Pendiente" && l.providerStatus !== "Pendiente") return "En Proceso";
  return "Pendiente";
}

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
  const [lines, setLines] = useState<Line[]>(() => {
    if (status === "Rechazada") {
      return initialLines.map((l) => ({
        ...l,
        pctCorbeta: 0,
        pctProveedor: 0,
        requiresMyAction: false,
        status: "Rechazada" as LineStatus,
      }));
    }
    return initialLines;
  });
  const [trace, setTrace] = useState<TraceEntry[]>(() => {
    const base: TraceEntry[] = [
      { at: "28/05/2026 09:12", who: "CorbeMóvil", action: "Preorden recibida" },
      { at: "28/05/2026 09:12", who: "Sistema", action: "Asignada a Moises Carmona" },
    ];
    if (status === "Rechazada") {
      base.push(
        {
          at: "28/05/2026 09:18",
          who: "Sistema",
          action: "Rechazada por regla de negocio",
          detail: "El % asumido por Corbeta (0%) y el % asumido por proveedor (0%) no superan el mínimo permitido (≥ 1%). La preorden queda en estado solo lectura.",
        },
      );
    }
    return base;
  });
  const [modal, setModal] = useState<{ kind: "modify" | "reject" | "cancel"; idx: number } | null>(null);
  const [gestionIdx, setGestionIdx] = useState<number | null>(null);
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
            onClick={() => {
              const dest = from === "reportes" ? "/panel/reportes" : from === "panel" ? "/panel" : "/panel/preordenes";
              navigate({ to: dest });
            }}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a {from === "reportes" ? "Reportes" : from === "panel" ? "Dashboard" : "Solicitudes"}
          </button>
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
      </section>

      {status === "Rechazada" && (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-destructive">Preorden rechazada por regla de negocio</h3>
                <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                  Solo lectura
                </span>
              </div>
              <p className="text-sm text-foreground/80">
                El % asumido por <span className="font-medium">Corbeta (0%)</span> y el % asumido por
                <span className="font-medium"> proveedor (0%)</span> no superan el mínimo permitido
                <span className="font-medium"> (≥ 1%)</span>. Por esta razón el sistema rechazó la preorden
                automáticamente y no se puede aprobar, modificar ni reenviar.
              </p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li>• Las acciones de gestión sobre las líneas están deshabilitadas.</li>
                <li>• Para procesar el descuento, el vendedor debe crear una nueva preorden con porcentajes válidos.</li>
                <li>• Consulta la trazabilidad al final de la página para ver el detalle del rechazo.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

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
                <th className="font-medium px-6 py-4">EAN / Producto</th>
                <th className="font-medium px-4 py-4 text-right">Cant.</th>
                <th className="font-medium px-4 py-4 text-right">Precio lista</th>
                <th className="font-medium px-4 py-4 text-right">% Corbeta</th>
                <th className="font-medium px-4 py-4 text-right">% Proveedor</th>
                <th className="font-medium px-4 py-4">Estado del producto</th>
                <th className="font-medium px-4 py-4">Estado proveedor</th>
                <th className="font-medium px-4 py-4">Estado aprobador</th>
                <th className="font-medium px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map((l, idx) => {
                const done = l.status !== "Pendiente";
                const productStatus = deriveProductStatus(l);
                return (
                  <tr key={l.ean} className="border-t border-border align-top hover:bg-muted/30">
                    <td className="px-6 py-5">
                      <div className="font-medium">{l.description}</div>
                      <div className="text-[11px] text-muted-foreground tabular-nums mt-1">EAN {l.ean}</div>
                    </td>
                    <td className="px-4 py-5 text-right tabular-nums">{l.qty}</td>
                    <td className="px-4 py-5 text-right tabular-nums">{fmtCOP(l.listPrice)}</td>
                    <td className="px-4 py-5 text-right tabular-nums">{l.pctCorbeta ?? 0}</td>
                    <td className="px-4 py-5 text-right tabular-nums">{l.pctProveedor ?? 0}</td>
                    <td className="px-4 py-5">
                      <ProductStatusBadge status={productStatus} />
                    </td>
                    <td className="px-4 py-5">
                      <ProviderBadge status={l.providerStatus} pct={l.providerPct} />
                    </td>
                    <td className="px-4 py-5">
                      <ApproverBadge status={l.approverStatus} pct={l.approverPct} />
                      {l.authorizedPct != null && (
                        <div className="mt-1 text-[11px] text-muted-foreground">% autorizado: {l.authorizedPct}</div>
                      )}
                      {l.reason && (
                        <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{l.reason}</div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <button
                          disabled={done || readOnly}
                          onClick={() => setGestionIdx(idx)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Gestionar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
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

      {/* Confirmar gestión */}
      {(() => {
        const allDone = lines.every((l) => l.status !== "Pendiente");
        const closed = readOnly || allDone;
        return (
          <div className="space-y-2">
            <button
              type="button"
              disabled={closed}
              onClick={() => {
                toast.success("Gestión confirmada", {
                  description: `Preorden ${id} actualizada correctamente.`,
                });
                setTrace((t) => [
                  ...t,
                  {
                    at: new Date().toLocaleString("es-CO"),
                    who: "Moises Carmona",
                    action: "Gestión confirmada",
                  },
                ]);
                navigate({ to: from === "reportes" ? "/panel/reportes" : from === "panel" ? "/panel" : "/panel/preordenes" });
              }}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar gestión
            </button>
            {closed && (
              <p className="text-center text-[11px] text-muted-foreground">
                {readOnly
                  ? "Esta solicitud está en modo solo lectura."
                  : "Todas las líneas ya fueron gestionadas."}
              </p>
            )}
          </div>
        );
      })()}

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

      {gestionIdx != null && lines[gestionIdx] && (
        <GestionModal
          item={{
            id,
            sku: lines[gestionIdx].ean,
            item: lines[gestionIdx].description,
            desc: "DTO-001",
            providerName: "Castrol",
            qty: lines[gestionIdx].qty,
            listPrice: fmtCOP(lines[gestionIdx].listPrice),
            corbetaPct: lines[gestionIdx].pctCorbeta != null ? `${lines[gestionIdx].pctCorbeta}%` : "—",
            supplierPct: lines[gestionIdx].pctProveedor != null ? `${lines[gestionIdx].pctProveedor}%` : "—",
            totalPct: `${(lines[gestionIdx].pctCorbeta ?? 0) + (lines[gestionIdx].pctProveedor ?? 0)}%`,
          }}
          onClose={() => setGestionIdx(null)}
          onConfirm={(_id, decision) => {
            const idx = gestionIdx;
            if (decision === "approve") approve(idx);
            else if (decision === "reject") applyReject(idx, "Rechazado por aprobador");
            else if (decision === "modify") applyModify(idx, lines[idx].pctCorbeta ?? 0);
            else if (decision === "cancel") applyCancel(idx, "Cancelado por aprobador");
            setGestionIdx(null);
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

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const map: Record<ProductStatus, string> = {
    Pendiente: "bg-primary/10 text-primary",
    "En Proceso": "bg-warning/10 text-warning",
    Finalizado: "bg-success/20 text-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function ProviderBadge({ status, pct }: { status: ProviderStatus; pct?: number }) {
  const map: Record<ProviderStatus, string> = {
    Pendiente: "bg-muted text-muted-foreground",
    Aprobado: "bg-success/20 text-foreground",
    Rechazado: "bg-destructive/10 text-destructive",
    Modificado: "bg-warning/10 text-warning",
  };
  const showPct = pct != null && (status === "Aprobado" || status === "Modificado");
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]}`}>
      {status}{showPct ? ` · ${pct}%` : ""}
    </span>
  );
}

function ApproverBadge({ status, pct }: { status: ApproverStatus; pct?: number }) {
  const map: Record<ApproverStatus, string> = {
    Pendiente: "bg-muted text-muted-foreground",
    Aprobado: "bg-success/20 text-foreground",
    Rechazado: "bg-destructive/10 text-destructive",
    Modificado: "bg-warning/10 text-warning",
    Cancelada: "bg-muted text-muted-foreground line-through",
  };
  const showPct = pct != null && (status === "Aprobado" || status === "Modificado");
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]}`}>
      {status === "Cancelada" ? "Línea cancelada" : `${status}${showPct ? ` · ${pct}%` : ""}`}
    </span>
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
