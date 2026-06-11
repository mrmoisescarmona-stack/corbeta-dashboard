import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reportes · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Reportes"
      description="Indicadores y reportes operativos del equipo."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
