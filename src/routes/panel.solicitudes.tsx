import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";

export const Route = createFileRoute("/panel/solicitudes")({
  component: () => (
    <ModuleStub
      title="Solicitudes"
      description="Todas las solicitudes de descuento del sistema."
    />
  ),
});
