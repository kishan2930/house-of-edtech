import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const cardTones = [
  'border-primary',
  'border-accent',
  'border-primary-light',
] as const;

export function WallSkeleton({
  count = 6,
  labelled = true,
}: {
  count?: number;
  labelled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {labelled ? <p className="sr-only">Loading Kudos</p> : null}
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-52 w-full rounded-xl border-l-[3px]',
            cardTones[index % cardTones.length],
          )}
        />
      ))}
    </div>
  );
}

export function MyKudosSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <p className="sr-only">Loading Kudos</p>
      <KudosSectionSkeleton titleWidth="w-36" />
      <KudosSectionSkeleton titleWidth="w-44" />
    </div>
  );
}

function KudosSectionSkeleton({ titleWidth }: { titleWidth: string }) {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className={cn('h-7', titleWidth)} />
      <WallSkeleton count={3} labelled={false} />
    </section>
  );
}
