import { Skeleton } from '@/components/ui/skeleton';

export function WallSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <p className="sr-only">Loading Kudos</p>
      <Skeleton className="h-32 w-full rounded-xl border-l-[3px] border-primary" />
      <Skeleton className="h-32 w-full rounded-xl border-l-[3px] border-accent" />
    </div>
  );
}
