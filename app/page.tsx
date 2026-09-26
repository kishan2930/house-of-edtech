import { redirect } from 'next/navigation';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-4 py-12">
      <h1 className="text-2xl font-extrabold tracking-[0.04em] text-foreground">
        Kudos Wall
      </h1>
      <p className="text-base text-foreground">
        Signed in as {session.user.name}.
      </p>
      <SignOutButton />
    </section>
  );
}
