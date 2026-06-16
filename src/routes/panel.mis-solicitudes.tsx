import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/panel/mis-solicitudes")({
  component: MisSolicitudes,
});

function MisSolicitudes() {
  const { primaryRole } = useAuth();
  const description =
    primaryRole === "aprobador"
      ? "Solicitudes asignadas a tu gestión para aprobar, rechazar, modificar o cancelar."
      : "Solicitudes de descuento pendientes de tu respuesta como proveedor.";
  return <ModuleStub title="Mis Solicitudes" description={description} />;
}
