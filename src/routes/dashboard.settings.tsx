import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Configuración · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Configuración"
      description="Preferencias del sistema y de tu cuenta."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
