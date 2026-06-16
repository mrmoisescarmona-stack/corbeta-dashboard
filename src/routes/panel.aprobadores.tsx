import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Approver = {
  name: string;
  identification: string;
  active: boolean;
};

type CategoryRow = {
  id: string;
  groupCode: string;
  direction: string;
  divisionCode: string;
  subdirection: string;
  lineCode: string;
  line: string;
  sublineCode: string;
  sublineName: string;
  category: string;
  categoryName: string;
  subcategoryCode: string;
  subcategoryName: string;
  familyCode: string;
  familyName: string;
  active: boolean;
  approvers: Approver[];
};

const categories: CategoryRow[] = [
  {
    id: "1",
    groupCode: "GRP-01",
    direction: "Electrodomésticos",
    divisionCode: "DIV-10",
    subdirection: "Línea Blanca",
    lineCode: "LIN-100",
    line: "Refrigeración",
    sublineCode: "SL-1001",
    sublineName: "Neveras y congeladores",
    category: "CAT-01",
    categoryName: "Neveras",
    subcategoryCode: "SCAT-001",
    subcategoryName: "Neveras no frost",
    familyCode: "FAM-001",
    familyName: "Neveras Samsung",
    active: true,
    approvers: [{ name: "María González", identification: "52123456", active: true }],
  },
  {
    id: "2",
    groupCode: "GRP-02",
    direction: "Tecnología",
    divisionCode: "DIV-20",
    subdirection: "Computación",
    lineCode: "LIN-200",
    line: "Televisores",
    sublineCode: "SL-2001",
    sublineName: "TV OLED",
    category: "CAT-02",
    categoryName: "Televisores premium",
    subcategoryCode: "SCAT-010",
    subcategoryName: "OLED 55 pulgadas",
    familyCode: "FAM-010",
    familyName: "LG OLED",
    active: true,
    approvers: [{ name: "Pedro Martínez", identification: "79123456", active: true }],
  },
  {
    id: "3",
    groupCode: "GRP-01",
    direction: "Electrodomésticos",
    divisionCode: "DIV-10",
    subdirection: "Línea Blanca",
    lineCode: "LIN-101",
    line: "Lavado",
    sublineCode: "SL-1002",
    sublineName: "Lavadoras",
    category: "CAT-03",
    categoryName: "Lavadoras automáticas",
    subcategoryCode: "SCAT-002",
    subcategoryName: "Carga frontal",
    familyCode: "FAM-002",
    familyName: "Lavadoras Samsung",
    active: true,
    approvers: [{ name: "María González", identification: "52123456", active: true }],
  },
  {
    id: "4",
    groupCode: "GRP-01",
    direction: "Electrodomésticos",
    divisionCode: "DIV-11",
    subdirection: "Cocción",
    lineCode: "LIN-110",
    line: "Hornos",
    sublineCode: "SL-1101",
    sublineName: "Hornos empotrables",
    category: "CAT-04",
    categoryName: "Hornos eléctricos",
    subcategoryCode: "SCAT-020",
    subcategoryName: "Hornos multifunción",
    familyCode: "FAM-020",
    familyName: "Hornos Whirlpool",
    active: true,
    approvers: [],
  },
  {
    id: "5",
    groupCode: "GRP-03",
    direction: "Hogar",
    divisionCode: "DIV-30",
    subdirection: "Cocina",
    lineCode: "LIN-300",
    line: "Pequeños electrodomésticos",
    sublineCode: "SL-3001",
    sublineName: "Microondas",
    category: "CAT-05",
    categoryName: "Microondas",
    subcategoryCode: "SCAT-030",
    subcategoryName: "Microondas convencionales",
    familyCode: "FAM-030",
    familyName: "Microondas LG",
    active: true,
    approvers: [],
  },
  {
    id: "6",
    groupCode: "GRP-02",
    direction: "Tecnología",
    divisionCode: "DIV-21",
    subdirection: "Móvil",
    lineCode: "LIN-210",
    line: "Tablets",
    sublineCode: "SL-2101",
    sublineName: "Tablets Android",
    category: "CAT-06",
    categoryName: "Tablets",
    subcategoryCode: "SCAT-040",
    subcategoryName: "Tablets 10 pulgadas",
    familyCode: "FAM-040",
    familyName: "Samsung Galaxy Tab",
    active: true,
    approvers: [
      { name: "María González", identification: "52123456", active: true },
      { name: "Pedro Martínez", identification: "79123456", active: true },
    ],
  },
];

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning" | "primary";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : tone === "primary"
          ? "text-primary"
          : "text-foreground";
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Activa" : "Inactiva"}
    </span>
  );
}

function ApproversDialog({
  row,
  onClose,
  onViewAll,
}: {
  row: CategoryRow | null;
  onClose: () => void;
  onViewAll: (row: CategoryRow) => void;
}) {
  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Aprobadores asignados</DialogTitle>
        </DialogHeader>
        {row && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Categoría</p>
              <p className="text-lg font-semibold">{row.familyName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.direction} · {row.line} · {row.categoryName}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                {row.approvers.length} usuario(s) asignado(s)
              </span>
            </div>

            {row.approvers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Esta categoría no tiene aprobadores asignados.
              </div>
            ) : (
              <div className="space-y-2">
                {row.approvers.map((a) => (
                  <div
                    key={a.identification + a.name}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {a.identification}
                      </p>
                    </div>
                    <StatusPill active={a.active} />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onViewAll(row)}
              className="flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-sm text-foreground transition hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              Ver todos los datos de la categoría
            </button>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDetailDialog({
  row,
  onClose,
}: {
  row: CategoryRow | null;
  onClose: () => void;
}) {
  const field = (label: string, value: string) => (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de la categoría</DialogTitle>
        </DialogHeader>
        {row && (
          <div className="grid grid-cols-2 gap-4">
            {field("Código Grupo", row.groupCode)}
            {field("Dirección", row.direction)}
            {field("Código de División", row.divisionCode)}
            {field("Subdirección", row.subdirection)}
            {field("Código Línea", row.lineCode)}
            {field("Línea", row.line)}
            {field("Código Sublínea", row.sublineCode)}
            {field("Nombre de la Sublínea", row.sublineName)}
            {field("Categoría", row.category)}
            {field("Nombre de la Categoría", row.categoryName)}
            {field("Código de Subcategoría", row.subcategoryCode)}
            {field("Nombre de la Subcategoría", row.subcategoryName)}
            {field("Familia", row.familyCode)}
            {field("Nombre de la Familia", row.familyName)}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AprobadoresPage() {
  const [search, setSearch] = useState("");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [lineFilter, setLineFilter] = useState<string>("all");
  const [approversOf, setApproversOf] = useState<CategoryRow | null>(null);
  const [detailOf, setDetailOf] = useState<CategoryRow | null>(null);

  const directions = useMemo(
    () => Array.from(new Set(categories.map((c) => c.direction))),
    [],
  );
  const lines = useMemo(
    () => Array.from(new Set(categories.map((c) => c.line))),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((c) => {
      if (directionFilter !== "all" && c.direction !== directionFilter) return false;
      if (lineFilter !== "all" && c.line !== lineFilter) return false;
      if (!q) return true;
      return [
        c.categoryName,
        c.familyName,
        c.line,
        c.direction,
        c.groupCode,
        c.sublineName,
        c.subcategoryName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [search, directionFilter, lineFilter]);

  const total = categories.length;
  const withApprovers = categories.filter((c) => c.approvers.length > 0).length;
  const withoutApprovers = total - withApprovers;
  const activeAssignments = categories.reduce(
    (n, c) => n + c.approvers.filter((a) => a.active).length,
    0,
  );

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Categorias de Productos</h1>
        <p className="text-sm text-muted-foreground">
          Consulta del árbol completo de categorías y aprobadores asignados por categoría
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total categorías" value={total} tone="primary" />
        <StatCard label="Con aprobadores" value={withApprovers} tone="success" />
        <StatCard label="Sin aprobadores" value={withoutApprovers} tone="warning" />
        <StatCard label="Asignaciones activas" value={activeAssignments} tone="primary" />
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Catálogo de categorías</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 border-b p-5 md:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en todas las categorías..."
              className="pl-9"
            />
          </div>
          <Select value={directionFilter} onValueChange={setDirectionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar dirección..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las direcciones</SelectItem>
              {directions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={lineFilter} onValueChange={setLineFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar línea..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las líneas</SelectItem>
              {lines.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Usuarios asignados</th>
                <th className="px-4 py-3 text-left font-medium">Código Grupo</th>
                <th className="px-4 py-3 text-left font-medium">Dirección</th>
                <th className="px-4 py-3 text-left font-medium">Código de División</th>
                <th className="px-4 py-3 text-left font-medium">Subdirección</th>
                <th className="px-4 py-3 text-left font-medium">Código Línea</th>
                <th className="px-4 py-3 text-left font-medium">Línea</th>
                <th className="px-4 py-3 text-left font-medium">Código Sublínea</th>
                <th className="px-4 py-3 text-left font-medium">Nombre de la Sublínea</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-left font-medium">Nombre de la Categoría</th>
                <th className="px-4 py-3 text-left font-medium">Código de Subcategoría</th>
                <th className="px-4 py-3 text-left font-medium">Nombre de la Subcategoría</th>
                <th className="px-4 py-3 text-left font-medium">Familia</th>
                <th className="px-4 py-3 text-left font-medium">Nombre de la Familia</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((row) => {
                const count = row.approvers.length;
                return (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setApproversOf(row)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                          count > 0
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        title="Ver aprobadores asignados"
                      >
                        <Users className="h-3.5 w-3.5" />
                        {count}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.groupCode}</td>
                    <td className="px-4 py-3">{row.direction}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.divisionCode}</td>
                    <td className="px-4 py-3">{row.subdirection}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.lineCode}</td>
                    <td className="px-4 py-3">{row.line}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.sublineCode}</td>
                    <td className="px-4 py-3">{row.sublineName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.category}</td>
                    <td className="px-4 py-3">{row.categoryName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.subcategoryCode}</td>
                    <td className="px-4 py-3">{row.subcategoryName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.familyCode}</td>
                    <td className="px-4 py-3">{row.familyName}</td>
                    <td className="px-4 py-3">
                      <StatusPill active={row.active} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No se encontraron categorías con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 text-xs text-muted-foreground">
          Mostrando {filtered.length} de {total} categorías. Haga clic en el número de usuarios asignados para ver el detalle.
        </div>
      </section>

      <ApproversDialog
        row={approversOf}
        onClose={() => setApproversOf(null)}
        onViewAll={(r) => {
          setApproversOf(null);
          setDetailOf(r);
        }}
      />
      <CategoryDetailDialog row={detailOf} onClose={() => setDetailOf(null)} />
    </div>
  );
}

export const Route = createFileRoute("/panel/aprobadores")({
  component: AprobadoresPage,
});
