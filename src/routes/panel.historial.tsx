import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";

export const Route = createFileRoute("/panel/historial")({
  component: () => (
    <ModuleStub
      title="Historial"
      description="Historial de respuestas a solicitudes de descuento."
    />
  ),
});
