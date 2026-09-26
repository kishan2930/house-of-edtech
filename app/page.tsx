import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { KudosWall } from '@/components/kudos/kudos-wall';
import { WallSkeleton } from '@/components/kudos/wall-skeleton';
import { PageHeading } from '@/components/layout/page-heading';
import { requireUser } from '@/lib/auth/session';
import { listKudos } from '@/lib/kudos/list';

export default function HomePage() {
  return (
    <PageHeading title="Kudos Wall">
      <Suspense fallback={<WallSkeleton />}>
        <WallFeed />
      </Suspense>
    </PageHeading>
  );
}

async function WallFeed() {
  const user = await requireUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { kudos } = await listKudos();

  return <KudosWall kudos={kudos} />;
}
