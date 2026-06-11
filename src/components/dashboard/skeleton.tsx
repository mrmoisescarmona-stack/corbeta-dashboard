import { cn } from "@/lib/utils";

export function Shimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-md", className)} {...props} />;
}

export function StatsSkeleton() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
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

export function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Shimmer className="h-8 w-8 rounded-lg" />
          <Shimmer className="h-4 w-44" />
        </div>
        <Shimmer className="h-3 w-16" />
      </div>
      <div className="flex flex-wrap gap-2 p-5 border-b border-border">
        <Shimmer className="h-9 flex-1 min-w-[200px]" />
        <Shimmer className="h-9 w-32" />
        <Shimmer className="h-9 w-28" />
        <Shimmer className="h-9 w-32" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Shimmer className="h-8 w-1 rounded-full" />
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-3 flex-1" />
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-3 w-12" />
      </div>
      <ul className="p-2 space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
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

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Shimmer className="h-8 w-72" />
        <Shimmer className="h-3 w-96" />
      </div>
      <StatsSkeleton />
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSkeleton />
        </div>
        <div className="space-y-6">
          <ActivitySkeleton />
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

export function PagePlaceholderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Shimmer className="h-8 w-64" />
        <Shimmer className="h-3 w-80" />
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </section>
    </div>
  );
}
