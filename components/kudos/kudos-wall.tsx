import { KudosCard } from '@/components/kudos/kudos-card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import type { KudosItem } from '@/lib/kudos/types';

export function KudosWall({ kudos }: { kudos: KudosItem[] }) {
  if (kudos.length === 0) {
    return (
      <Empty className="border border-dashed border-primary-light bg-card shadow-card">
        <EmptyHeader>
          <EmptyTitle className="font-extrabold text-foreground">
            No Kudos yet.
          </EmptyTitle>
          <EmptyDescription>Recognize a teammate.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {kudos.map((item) => (
        <li key={item.id}>
          <KudosCard item={item} />
        </li>
      ))}
    </ul>
  );
}
