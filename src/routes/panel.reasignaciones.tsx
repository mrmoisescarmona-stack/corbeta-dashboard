import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";

export const Route = createFileRoute("/panel/reasignaciones")({
  component: () => (
    <ModuleStub
      title="Reasignaciones"
      description="Reasigna solicitudes individuales o ejecuta reasignaciones masivas."
    />
  ),
});
