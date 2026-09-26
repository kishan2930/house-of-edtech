import Link from 'next/link';

import { ProfileMenu } from '@/components/layout/profile-menu';
import { Wordmark } from '@/components/layout/wordmark';
import { CreateKudosDialog } from '@/components/kudos/create-kudos-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { auth } from '@/auth';

export async function Header() {
  const session = await auth();
  const name = session?.user?.name;

  return (
    <header className="border-b border-primary-light">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Wordmark compact />
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {name ? (
            <>
              <CreateKudosDialog senderName={name} />
              <ProfileMenu name={name} />
            </>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
