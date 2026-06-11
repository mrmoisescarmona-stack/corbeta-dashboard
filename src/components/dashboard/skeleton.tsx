import { cn } from "@/lib/utils";

export function Shimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-md", className)} {...props} />;
}

/* ---------- Generic blocks reused by overview ---------- */

export function StatsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section
      className={cn(
        "grid gap-4",
        count === 4
          ? "grid-cols-2 md:grid-cols-4"
          : "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <Shimmer className="h-10 w-10 rounded-lg" />
            <Shimmer className="h-3 w-14" />
          </div>
          <Shimmer className="h-8 w-20" />
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-3 w-16" />
        </div>
      ))}
    </section>
  );
}

export function FiltersSkeleton({ chips = 3 }: { chips?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-5 border-b border-border">
      <Shimmer className="h-9 flex-1 min-w-[200px]" />
      {Array.from({ length: chips }).map((_, i) => (
        <Shimmer key={i} className="h-9 w-28" />
      ))}
      <Shimmer className="h-9 w-24" />
    </div>
  );
}

export function TableHeaderSkeleton({ title = true }: { title?: boolean }) {
  if (!title) return null;
  return (
    <div className="flex items-center justify-between p-5 border-b border-border">
      <div className="flex items-center gap-2.5">
        <Shimmer className="h-8 w-8 rounded-lg" />
        <Shimmer className="h-4 w-44" />
      </div>
      <Shimmer className="h-3 w-16" />
    </div>
  );
}

export function TableRowsSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  // pre-defined width pattern per column index
  const widths = ["w-32", "flex-1", "w-24", "w-20", "w-20", "w-20", "w-16", "w-16"];
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          <Shimmer className="h-8 w-1 rounded-full" />
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer
              key={c}
              className={cn(
                "h-3",
                c === 0 ? "w-32" : c === 1 ? "flex-1" : widths[c] ?? "w-20",
                c === cols - 1 && "rounded-full",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 p-5 border-t border-border">
      <Shimmer className="h-3 w-44" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-8 w-8" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 6,
  chips = 3,
  withPagination = true,
}: {
  rows?: number;
  cols?: number;
  chips?: number;
  withPagination?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <TableHeaderSkeleton />
      <FiltersSkeleton chips={chips} />
      <TableRowsSkeleton rows={rows} cols={cols} />
      {withPagination && <PaginationSkeleton />}
    </div>
  );
}

export function ActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-3 w-12" />
      </div>
      <ul className="p-2 space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex gap-3 p-3">
            <Shimmer className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-3 w-12" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DonutSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Shimmer className="h-4 w-48" />
      <div className="mt-4 flex items-center gap-6">
        <Shimmer className="h-44 w-44 rounded-full" />
        <ul className="flex-1 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-2">
              <Shimmer className="h-2.5 w-2.5 rounded-sm" />
              <Shimmer className="h-3 flex-1" />
              <Shimmer className="h-3 w-8" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <Shimmer className="h-4 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 w-44" />
        <Shimmer className="h-8 w-24" />
      </div>
      <Shimmer className="h-56 w-full" />
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-20" />
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton({ withAction = true }: { withAction?: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-3">
        <Shimmer className="h-8 w-72" />
        <Shimmer className="h-3 w-96" />
      </div>
      {withAction && <Shimmer className="h-10 w-40" />}
    </div>
  );
}

/* ---------- Page-specific compositions ---------- */

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatsSkeleton count={5} />
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSkeleton rows={5} cols={6} chips={3} />
        </div>
        <div className="space-y-6">
          <ActivitySkeleton rows={4} />
          <DonutSkeleton />
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardSkeleton rows={2} />
        <CardSkeleton rows={4} />
        <CardSkeleton rows={2} />
      </section>
    </div>
  );
}

export function ApprovalsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatsSkeleton count={4} />
      <TableSkeleton rows={8} cols={7} chips={3} />
    </div>
  );
}

export function RequestsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatsSkeleton count={4} />
      <TableSkeleton rows={10} cols={7} chips={4} />
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatsSkeleton count={4} />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonutSkeleton />
        <div className="lg:col-span-2">
          <ChartCardSkeleton />
        </div>
      </section>
    </div>
  );
}

export function ProvidersSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FiltersSkeleton chips={2} />
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Shimmer className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-32" />
                <Shimmer className="h-3 w-24" />
              </div>
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <Shimmer className="h-3 w-12" />
                  <Shimmer className="h-5 w-16" />
                </div>
              ))}
            </div>
            <Shimmer className="h-9 w-full" />
          </div>
        ))}
      </section>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton withAction={false} />
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-9 w-full" />
          ))}
        </nav>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, s) => (
            <div key={s} className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div className="space-y-2">
                <Shimmer className="h-4 w-40" />
                <Shimmer className="h-3 w-72" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, f) => (
                  <div key={f} className="space-y-2">
                    <Shimmer className="h-3 w-24" />
                    <Shimmer className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Shimmer className="h-9 w-24" />
                <Shimmer className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuditSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FiltersSkeleton chips={4} />
      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="flex items-start gap-4 p-4">
              <Shimmer className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3 w-2/3" />
                <Shimmer className="h-3 w-1/3" />
              </div>
              <div className="space-y-2 text-right">
                <Shimmer className="ml-auto h-3 w-24" />
                <Shimmer className="ml-auto h-3 w-16" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="flex items-start gap-4 p-4">
              <Shimmer className="h-2 w-2 mt-2 rounded-full" />
              <Shimmer className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3 w-3/4" />
                <Shimmer className="h-3 w-1/2" />
              </div>
              <Shimmer className="h-3 w-16" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Backwards-compat default for any callers still using the generic name
export const PagePlaceholderSkeleton = ApprovalsSkeleton;
