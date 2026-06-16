import { Construction } from "lucide-react";

export function ModuleStub({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Construction className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Próximamente</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Este módulo está en construcción. Pronto podrás gestionarlo desde aquí.
        </p>
      </div>
    </div>
  );
}
