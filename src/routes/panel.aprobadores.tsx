import { createFileRoute } from "@tanstack/react-router";
import { ModuleStub } from "@/components/module-stub";

export const Route = createFileRoute("/panel/aprobadores")({
  component: () => (
    <ModuleStub
      title="Aprobadores"
      description="Crea, edita y desactiva aprobadores del sistema."
    />
  ),
});
