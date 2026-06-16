import { createFileRoute } from "@tanstack/react-router";
import { SettingsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/panel/configuracion")({
  head: () => ({ meta: [{ title: "Configuración · Corbeta" }] }),
  component: SettingsPage,
  pendingComponent: SettingsSkeleton,
});

const navSections = ["Perfil", "Seguridad", "Equipo", "Aprobaciones", "Notificaciones", "Integraciones"];

const sections = [
  {
    title: "Perfil",
    description: "Información personal asociada a tu cuenta.",
    fields: [
      ["Nombre", "Moises Carmona"],
      ["Correo", "kpaz@corbeta.com.co"],
      ["Cargo", "Aprobador Interno"],
      ["Zona", "Centro"],
    ],
  },
  {
    title: "Reglas de aprobación",
    description: "Umbrales y políticas que se aplican a tus solicitudes.",
    fields: [
      ["Monto máximo", "$ 15.000.000"],
      ["SLA interno", "24 horas"],
      ["Doble aprobación", "Activado"],
      ["Auto-asignación", "Activado"],
    ],
  },
  {
    title: "Notificaciones",
    description: "Cómo y cuándo quieres recibir alertas.",
    fields: [
      ["Email", "Activado"],
      ["Slack", "Desactivado"],
      ["Resumen diario", "08:00 a.m."],
      ["Vencimientos SLA", "1h antes"],
    ],
  },
];

function PasswordSection() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setPassword("");
    setConfirm("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "No se pudo actualizar la contraseña.");
      return;
    }
    toast.success("Contraseña actualizada correctamente.");
    reset();
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h3 className="text-base font-semibold">Cambiar contraseña</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza la contraseña asociada a tu cuenta. Debes ingresarla dos veces para confirmar.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Repetir contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      </form>
    </section>
  );
}

function SettingsPage() {
  if (useFakeLoading()) return <SettingsSkeleton />;
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Configuración</h2>
        <p className="mt-1 text-sm text-muted-foreground">Preferencias del sistema y de tu cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {navSections.map((s, i) => (
            <button key={s} className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-accent"}`}>
              {s}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {sections.map((s, idx) => (
            <>
              <section key={s.title} className="rounded-xl border border-border bg-card p-6 space-y-5">
                <div>
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {s.fields.map(([label, value]) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{label}</label>
                      <input defaultValue={value} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Cancelar</button>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Guardar cambios</button>
                </div>
              </section>
              {idx === 0 && <PasswordSection key="password-section" />}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
