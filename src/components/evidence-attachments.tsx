import { useState } from "react";
import { UploadCloud, Mail, Eye, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type EvidenceFile = {
  name: string;
  size: string;
  by: string;
  date: string;
  status: "Validado" | "Pendiente" | "Rechazado";
};

const ALLOWED_EXT = [".eml", ".msg", ".oft", ".emlx"];
const MAX_BYTES = 10 * 1024 * 1024;

export function FileDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
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

export function EvidenceAttachments({
  files,
  onAdd,
  onRemove,
  required = true,
}: {
  files: EvidenceFile[];
  onAdd: (files: File[]) => void;
  onRemove?: (index: number) => void;
  required?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 mb-1">
        <h5 className="text-sm font-semibold text-foreground">Adjuntar evidencia del proveedor</h5>
        {required && (
          <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
            Obligatorio
          </span>
        )}
      </div>
      {required && (
        <p className="text-xs text-muted-foreground">
          Los soportes son obligatorios para continuar con el flujo de aprobación.
        </p>
      )}

      <FileDropzone onFiles={onAdd} />

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
                  
                  <th className="text-right font-medium px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => {
                  const badgeCls =
                    f.status === "Validado"
                      ? "bg-success/10 text-success"
                      : f.status === "Rechazado"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning";
                  return (
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
                      <td className="px-3 py-2 text-foreground">{f.date}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Ver">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Descargar">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onRemove?.(i)}
                            className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            ⓘ Puede adjuntar múltiples archivos. Los archivos serán validados automáticamente.
          </p>
        </div>
      )}
    </div>
  );
}
