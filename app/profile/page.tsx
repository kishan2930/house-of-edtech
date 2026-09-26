import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';

import { PageHeading } from '@/components/layout/page-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export default function ProfilePage() {
  return (
    <PageHeading title="My Profile">
      <Suspense
        fallback={
          <Skeleton className="h-24 w-full rounded-[12px] bg-card shadow-card" />
        }
      >
        <ProfileDetails />
      </Suspense>
    </PageHeading>
  );
}

async function ProfileDetails() {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    redirect('/sign-in');
  }

  await connectDB();

  const user = await User.findById(sessionUser.id).select('name email');

  if (!user) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-1 rounded-[12px] bg-card p-5 text-card-foreground shadow-card">
      <h2 className="text-xl font-extrabold tracking-[0.04em]">{user.name}</h2>
      <p className="text-base">{user.email}</p>
    </article>
  );
}
