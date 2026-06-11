import { createFileRoute } from "@tanstack/react-router";
import { SettingsSkeleton } from "@/components/dashboard/skeleton";
import { useFakeLoading } from "@/hooks/use-fake-loading";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Configuración · Corbeta" }] }),
  component: SettingsPage,
  pendingComponent: SettingsSkeleton,
});

const navSections = ["Perfil", "Equipo", "Aprobaciones", "Notificaciones", "Integraciones"];

const sections = [
  {
    title: "Perfil",
    description: "Información personal asociada a tu cuenta.",
    fields: [
      ["Nombre", "Ana Carolina"],
      ["Correo", "ana.carolina@corbeta.com"],
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
          {sections.map((s) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
