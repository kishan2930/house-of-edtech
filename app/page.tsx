import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { KudosFilter, type WallFilter } from '@/components/kudos/kudos-filter';
import { KudosWall } from '@/components/kudos/kudos-wall';
import { WallSkeleton } from '@/components/kudos/wall-skeleton';
import { PageHeading } from '@/components/layout/page-heading';
import { requireUser } from '@/lib/auth/session';
import { listKudos, listPeople, type KudosPerson } from '@/lib/kudos/list';
import { isKudosTemplate } from '@/lib/kudos/templates';
import { isObjectId } from '@/lib/validators/kudos';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    template?: string | string[];
    user?: string | string[];
  }>;
}) {
  const user = await requireUser();

  if (!user) {
    redirect('/sign-in');
  }

  const [params, people] = await Promise.all([searchParams, listPeople()]);
  const filter = resolveWallFilter(params, people);

  return (
    <PageHeading
      title="Kudos Wall"
      wide
      action={<KudosFilter filter={filter} people={people} />}
    >
      <Suspense fallback={<WallSkeleton />}>
        <WallFeed viewerId={user.id} filter={filter} />
      </Suspense>
    </PageHeading>
  );
}

async function WallFeed({
  viewerId,
  filter,
}: {
  viewerId: string;
  filter: WallFilter;
}) {
  const { kudos } = await listKudos(viewerId, 'wall', {
    template: filter.kind === 'template' ? filter.template : undefined,
    personId: filter.kind === 'person' ? filter.person.id : undefined,
  });

  return <KudosWall kudos={kudos} viewerId={viewerId} filter={filter} />;
}

function resolveWallFilter(
  params: { template?: string | string[]; user?: string | string[] },
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

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
