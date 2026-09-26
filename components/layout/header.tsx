import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Kudos Wall
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
