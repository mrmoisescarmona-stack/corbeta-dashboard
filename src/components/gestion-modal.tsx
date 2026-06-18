import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Ban, Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { EvidenceAttachments, type EvidenceFile } from "@/components/evidence-attachments";

export type GestionItem = {
  id: string;
  sku: string;
  item: string;
  desc: string;
  providerName: string;
  qty: number | string;
  listPrice: string;
  corbetaPct: string;
  supplierPct: string;
  totalPct: string;
};

export type Decision = "approve" | "reject" | "modify" | "cancel";
export type GestionRole = "provider" | "approver";

export function GestionModal({
  item,
  role = "approver",
  onClose,
  onConfirm,
}: {
  item: GestionItem;
  role?: GestionRole;
  onClose: () => void;
  onConfirm: (id: string, decision: Decision) => void;
}) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [justif, setJustif] = useState("");
  const [nuevoPct, setNuevoPct] = useState("");
  const [tipoDescuento, setTipoDescuento] = useState("");
  const [tipoExclusion, setTipoExclusion] = useState("no-mutuamente");
  const [files, setFiles] = useState<EvidenceFile[]>([]);

  const handleAddFiles = (fl: File[]) => {
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
      fl.length === 1 ? `Archivo adjuntado: ${fl[0].name}` : `${fl.length} archivos adjuntados correctamente`
    );
  };

  const isApprover = role === "approver";
  const title = isApprover ? "Respuesta del Aprobador" : "Respuesta del Proveedor";
  const ctaCls = isApprover
    ? "bg-violet-600 text-white hover:bg-violet-700"
    : "bg-primary text-primary-foreground hover:opacity-90";

  const needsTipoDescuento = isApprover && !tipoDescuento;
  const canConfirm = decision !== null && !needsTipoDescuento;

  const baseActions: { key: Decision; label: string; icon: any; cls: string }[] = [
    { key: "approve", label: "Aprobar", icon: Check, cls: "hover:border-success hover:bg-success/5" },
    { key: "reject", label: "Rechazar", icon: X, cls: "hover:border-destructive hover:bg-destructive/5" },
    { key: "modify", label: "Modificar y aprobar", icon: Pencil, cls: "hover:border-primary hover:bg-primary/5" },
  ];
  const actions = isApprover
    ? [...baseActions, { key: "cancel" as Decision, label: "Cancelar línea", icon: Ban, cls: "hover:border-muted-foreground hover:bg-muted/40" }]
    : baseActions;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-xl border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-foreground truncate">{title}</h3>
              <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-medium text-warning ring-1 ring-inset ring-warning/30">
                Pendiente
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.sku} — {item.item} · Descuento: {item.desc} · Proveedor: {item.providerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Cantidad</div>
              <div className="font-medium tabular-nums">{item.qty}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Precio lista</div>
              <div className="font-medium tabular-nums">{item.listPrice}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">% Corbeta solicitado</div>
              <div className="font-medium tabular-nums">{item.corbetaPct}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">% Proveedor solicitado</div>
              <div className="font-medium tabular-nums">{item.supplierPct}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-foreground">
                {isApprover ? "Acción del aprobador" : "Acción del proveedor"}
              </div>
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
                          : `border-border bg-background text-foreground ${a.cls}`
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {isApprover && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Tipo de descuento <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={tipoDescuento}
                    onChange={(e) => setTipoDescuento(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Seleccionar…</option>
                    <option value="visible">Visible</option>
                    <option value="oculto">Oculto</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Tipo de exclusión <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={tipoExclusion}
                    onChange={(e) => setTipoExclusion(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="no-mutuamente">No mutuamente excluyente</option>
                    <option value="mutuamente">Mutuamente excluyente</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">
                Justificación <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <textarea
                value={justif}
                onChange={(e) => setJustif(e.target.value)}
                placeholder="Ingrese la justificación de su decisión…"
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {decision === "modify" && (
              <div>
                <label className="text-sm font-medium text-foreground">
                  Nuevo porcentaje <span className="text-destructive">*</span>
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="number"
                    value={nuevoPct}
                    onChange={(e) => setNuevoPct(e.target.value)}
                    placeholder="Ej: 7.5"
                    min={0}
                    max={100}
                    step="0.1"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Anexar nuevo porcentaje aprobado para esta línea.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          <EvidenceAttachments
            files={files}
            onAdd={handleAddFiles}
            onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>

        <div className="border-t border-border p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/panel/preordenes/$id"
              params={{ id: item.id }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Ver detalle completo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              disabled={!canConfirm}
              onClick={() => decision && onConfirm(item.id, decision)}
              className={`inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${ctaCls}`}
            >
              {isApprover ? "Confirmar análisis" : "Confirmar gestión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
