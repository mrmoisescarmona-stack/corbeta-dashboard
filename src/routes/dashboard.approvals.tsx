import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/approvals")({
  head: () => ({ meta: [{ title: "Mis aprobaciones · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Mis aprobaciones"
      description="Solicitudes asignadas a ti para revisión y aprobación."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
