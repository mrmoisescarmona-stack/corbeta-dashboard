import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { PagePlaceholderSkeleton } from "@/components/dashboard/skeleton";

export const Route = createFileRoute("/dashboard/providers")({
  head: () => ({ meta: [{ title: "Proveedores · Corbeta" }] }),
  component: () => (
    <PlaceholderPage
      title="Proveedores"
      description="Catálogo y desempeño de proveedores."
    />
  ),
  pendingComponent: PagePlaceholderSkeleton,
});
