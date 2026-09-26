import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { KudosCard } from '@/components/kudos/kudos-card';
import { MyKudosSkeleton } from '@/components/kudos/wall-skeleton';
import { PageHeading } from '@/components/layout/page-heading';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { requireUser } from '@/lib/auth/session';
import { listKudos } from '@/lib/kudos/list';
import type { KudosItem } from '@/lib/kudos/types';

export default function MyKudosPage() {
  return (
    <PageHeading title="My Kudos" wide>
      <Suspense fallback={<MyKudosSkeleton />}>
        <MyKudosLists />
      </Suspense>
    </PageHeading>
  );
}

async function MyKudosLists() {
  const user = await requireUser();

  if (!user) {
    redirect('/sign-in');
  }

  const [given, received] = await Promise.all([
    listKudos(user.id, 'given'),
    listKudos(user.id, 'received'),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <KudosSection
        title="Kudos given"
        empty="You have not given Kudos yet."
        kudos={given.kudos}
        viewerId={user.id}
      />
      <KudosSection
        title="Kudos received"
        empty="You have not received Kudos yet."
        kudos={received.kudos}
        viewerId={user.id}
      />
    </div>
  );
}

function KudosSection({
  title,
  empty,
  kudos,
  viewerId,
}: {
  title: string;
  empty: string;
  kudos: KudosItem[];
  viewerId: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-dashed border-primary-light pb-2 text-lg font-extrabold tracking-[0.04em] text-foreground">
        {title}
      </h2>
      {kudos.length === 0 ? (
        <Empty className="border border-dashed border-primary-light bg-card shadow-card">
          <EmptyHeader>
            <EmptyTitle className="font-extrabold text-foreground">
              {empty}
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kudos.map((item) => (
            <li key={item.id} className="min-w-0">
              <KudosCard item={item} viewerId={viewerId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
