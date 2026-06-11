import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/audit")({
  head: () => ({ meta: [{ title: "Auditoría · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Auditoría"
      description="Registro histórico de eventos del sistema."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
