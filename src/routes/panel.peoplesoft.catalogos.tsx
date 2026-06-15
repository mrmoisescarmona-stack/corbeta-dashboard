import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Package, Building2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/peoplesoft/lookups")({
  head: () => ({ meta: [{ title: "Catálogos PeopleSoft · Corbeta" }] }),
  component: LookupsPage,
});

const cards = [
  {
    icon: CreditCard,
    title: "Condición de pago",
    code: "Integración #9",
    desc: "Términos de pago del cliente extraídos de PeopleSoft.",
    rows: [
      ["Distribuidora del Valle", "30 días · Crédito"],
      ["Moto Repuestos Norte", "Contado"],
      ["Comercializadora Andina", "45 días · Crédito"],
    ],
  },
  {
    icon: Package,
    title: "Clasificación de productos",
    code: "Integración #10",
    desc: "Maestro de categorías de producto desde PeopleSoft.",
    rows: [
      ["Lubricantes", "LUB-001"],
      ["Filtros", "FIL-002"],
      ["Refrigerantes", "REF-003"],
    ],
  },
  {
    icon: Building2,
    title: "Info de proveedores",
    code: "Integración #11",
    desc: "Datos maestros de proveedores sincronizados desde PeopleSoft.",
    rows: [
      ["Castrol", "PRV-1042"],
      ["Shell", "PRV-1051"],
      ["Mobil", "PRV-1063"],
    ],
  },
];

function LookupsPage() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.code}</div>
                <div className="font-semibold">{c.title}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.desc}</p>
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-background text-sm">
              {c.rows.map(([a, b]) => (
                <li key={a} className="flex items-center justify-between px-3 py-2">
                  <span className="truncate">{a}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
