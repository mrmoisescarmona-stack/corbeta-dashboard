import { createFileRoute } from "@tanstack/react-router";
import { PreordenDetail } from "@/components/preorden-detail";

export const Route = createFileRoute("/panel/preordenes/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Solicitud ${params.id} · Corbeta` }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    const from = search.from;
    return {
      from:
        from === "reportes" || from === "panel" || from === "preordenes" || from === "solicitudes"
          ? (from as "reportes" | "panel" | "preordenes" | "solicitudes")
          : undefined,
      status: typeof search.status === "string" ? (search.status as string) : undefined,
    };
  },
  component: RequestDetailPage,
});

function RequestDetailPage() {
  const { id } = Route.useParams();
  const { from, status } = Route.useSearch();
  return <PreordenDetail id={id} from={from} status={status} />;
}
