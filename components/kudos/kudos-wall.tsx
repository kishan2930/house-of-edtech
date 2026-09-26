import { KudosCard } from '@/components/kudos/kudos-card';
import type { WallFilter } from '@/components/kudos/kudos-filter';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import type { KudosItem } from '@/lib/kudos/types';

export function KudosWall({
  kudos,
  viewerId,
  filter,
}: {
  kudos: KudosItem[];
  viewerId: string;
  filter: WallFilter;
}) {
  if (kudos.length === 0) {
    return (
      <Empty className="border border-dashed border-primary-light bg-card shadow-card">
        <EmptyHeader>
          <EmptyTitle className="font-extrabold text-foreground">
            {emptyTitle(filter)}
          </EmptyTitle>
          <EmptyDescription>{emptyDescription(filter)}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kudos.map((item) => (
        <li key={item.id} className="min-w-0">
          <KudosCard item={item} viewerId={viewerId} />
        </li>
      ))}
    </ul>
  );
}

function emptyTitle(filter: WallFilter) {
  if (filter.kind === 'template') {
    return 'No Kudos in this type.';
  }

  if (filter.kind === 'person') {
    return `No Kudos for ${filter.person.name}.`;
  }

  return 'No Kudos yet.';
}

function emptyDescription(filter: WallFilter) {
  if (filter.kind === 'all') {
    return 'Recognize a teammate.';
  }

  return 'Choose another filter.';
}
