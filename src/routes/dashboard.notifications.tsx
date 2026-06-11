import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notificaciones · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Notificaciones"
      description="Alertas y comunicaciones recientes."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
