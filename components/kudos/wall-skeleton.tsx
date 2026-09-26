import { Skeleton } from '@/components/ui/skeleton';

export function WallSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <p className="sr-only">Loading Kudos</p>
      <Skeleton className="h-52 w-full rounded-xl border-l-[3px] border-primary" />
      <Skeleton className="h-52 w-full rounded-xl border-l-[3px] border-accent" />
      <Skeleton className="h-52 w-full rounded-xl border-l-[3px] border-primary-light" />
    </div>
  );
}
