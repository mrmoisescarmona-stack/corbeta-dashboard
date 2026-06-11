import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/requests")({
  head: () => ({ meta: [{ title: "Solicitudes · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Solicitudes"
      description="Listado completo de solicitudes de descuento."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
