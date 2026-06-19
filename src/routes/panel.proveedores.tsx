import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, Mail, Phone } from "lucide-react";
import { ApprovalsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  type Provider,
  providers,
  StatusBadge,
  SectionCard,
  PrimaryButton,
  NewProviderDialog,
  ProviderPreviewDialog,
  STORAGE_KEY,
  loadStored,
} from "./panel.workflow";

export const Route = createFileRoute("/panel/proveedores")({
  head: () => ({ meta: [{ title: "Proveedores · Corbeta" }] }),
  component: ProveedoresPage,
  pendingComponent: ApprovalsSkeleton,
});

// Deterministic hash-based pseudo-random so values stay stable per provider id.
function seededFromId(id: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function ProveedoresPage() {
  const [providerList, setProviderList] = useState<Provider[]>(() => loadStored("providers", providers));
  const [newProviderOpen, setNewProviderOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<Provider | null>(null);
  const [previewProvider, setPreviewProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...parsed, providers: providerList })
      );
    } catch {
      /* ignore quota */
    }
  }, [providerList]);

  const metrics = useMemo(
    () =>
      providerList.map((p) => {
        const r = seededFromId(p.id, 1);
        const t = seededFromId(p.id, 2);
        const e1 = seededFromId(p.id, 3);
        const e2 = seededFromId(p.id, 4);
        const eanBody = String(Math.floor(e1 * 1e9) * 1000 + Math.floor(e2 * 1000)).padStart(12, "0").slice(0, 12);
        return {
          requests: 20 + Math.floor(r * 130), // 20-149 requests
          avgHours: (3 + t * 6).toFixed(1) + "h", // 3.0h - 9.0h
          ean: "770" + eanBody.slice(0, 10), // 13-digit EAN-like
          productProvider: p.name.split(" ")[0],
        };
      }),
    [providerList]
  );


  if (useFakeLoading()) return <ApprovalsSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Proveedores</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Registro de proveedores, contacto e indicadores operativos
        </p>
      </div>

      <SectionCard
        title="Proveedores"
        subtitle="Registro de proveedores por categoría — acuerdo SLS"
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
                <th className="font-medium px-3 py-3 text-right">Solicitudes</th>
                <th className="font-medium px-3 py-3 text-right">Tiempo prom.</th>
                <th className="font-medium px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {providerList.map((p, i) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-medium tabular-nums">{p.id}</td>
                  <td className="px-3 py-3.5">{p.name}</td>
                  <td className="px-3 py-3.5">{p.category}</td>
                  <td className="px-3 py-3.5 text-muted-foreground">{p.email}</td>
                  <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{p.phone}</td>
                  <td className="px-3 py-3.5"><StatusBadge active={p.active} /></td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{metrics[i].requests}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums text-muted-foreground">{metrics[i].avgHours}</td>
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
                      <button onClick={() => setEditingProvider(p)} className="rounded-md p-1.5 hover:bg-accent" aria-label="Editar" title="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeletingProvider(p)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" aria-label="Eliminar" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <NewProviderDialog
        open={newProviderOpen}
        onClose={() => setNewProviderOpen(false)}
        onSave={(p) => {
          if (providerList.some((x) => x.id === p.id)) {
            toast.error(`Ya existe un proveedor con identificación ${p.id}`);
            return;
          }
          setProviderList((prev) => [...prev, p]);
          toast.success(`Proveedor "${p.name}" agregado`);
          setNewProviderOpen(false);
        }}
      />
      <NewProviderDialog
        open={!!editingProvider}
        initial={editingProvider}
        onClose={() => setEditingProvider(null)}
        onSave={(p) => {
          if (!editingProvider) return;
          setProviderList((prev) => prev.map((x) => (x.id === editingProvider.id ? p : x)));
          toast.success(`Proveedor "${p.name}" actualizado`);
          setEditingProvider(null);
        }}
      />
      <Dialog open={!!deletingProvider} onOpenChange={(o) => !o && setDeletingProvider(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar proveedor</DialogTitle>
            <DialogDescription>
              {deletingProvider && `¿Eliminar al proveedor "${deletingProvider.name}"? Esta acción no se puede deshacer.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setDeletingProvider(null)}
              className="rounded-md border border-border bg-background px-3.5 py-2 text-sm hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!deletingProvider) return;
                setProviderList((prev) => prev.filter((p) => p.id !== deletingProvider.id));
                toast.success(`Proveedor "${deletingProvider.name}" eliminado`);
                setDeletingProvider(null);
              }}
              className="rounded-md bg-destructive px-3.5 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
            >
              Eliminar
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
