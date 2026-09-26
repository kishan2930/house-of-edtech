import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { KudosFilter, type WallFilter } from '@/components/kudos/kudos-filter';
import { KudosWall } from '@/components/kudos/kudos-wall';
import { WallSkeleton } from '@/components/kudos/wall-skeleton';
import { PageHeading } from '@/components/layout/page-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { requireUser } from '@/lib/auth/session';
import { listKudos, listPeople, type KudosPerson } from '@/lib/kudos/list';
import { isKudosTemplate } from '@/lib/kudos/templates';
import { isObjectId } from '@/lib/validators/kudos';

type WallSearchParams = {
  template?: string | string[];
  user?: string | string[];
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<WallSearchParams>;
}) {
  const user = await requireUser();

  if (!user) {
    redirect('/sign-in');
  }

  const params = await searchParams;

  return (
    <PageHeading
      title="Kudos Wall"
      wide
      action={
        <Suspense fallback={<Skeleton className="h-8 w-24 rounded-full" />}>
          <WallFilter params={params} />
        </Suspense>
      }
    >
      <Suspense key={wallFilterKey(params)} fallback={<WallSkeleton />}>
        <WallFeed viewerId={user.id} params={params} />
      </Suspense>
    </PageHeading>
  );
}

async function WallFilter({ params }: { params: WallSearchParams }) {
  const people = await listPeople();

  return (
    <KudosFilter filter={resolveWallFilter(params, people)} people={people} />
  );
}

async function WallFeed({
  viewerId,
  params,
}: {
  viewerId: string;
  params: WallSearchParams;
}) {
  const people = await listPeople();
  const filter = resolveWallFilter(params, people);
  const { kudos } = await listKudos(viewerId, 'wall', {
    template: filter.kind === 'template' ? filter.template : undefined,
    personId: filter.kind === 'person' ? filter.person.id : undefined,
  });

  return <KudosWall kudos={kudos} viewerId={viewerId} filter={filter} />;
}

function resolveWallFilter(
  params: WallSearchParams,
  people: KudosPerson[],
): WallFilter {
  const requestedUser = firstParam(params.user);
  const person =
    requestedUser && isObjectId(requestedUser)
      ? people.find((entry) => entry.id === requestedUser)
      : undefined;

  if (person) {
    return { kind: 'person', person };
  }

  const requestedTemplate = firstParam(params.template);

  if (requestedTemplate && isKudosTemplate(requestedTemplate)) {
    return { kind: 'template', template: requestedTemplate };
  }

  return { kind: 'all' };
}

function wallFilterKey(params: WallSearchParams) {
  return `${firstParam(params.template) ?? ''}:${firstParam(params.user) ?? ''}`;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
