'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileMenu({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-11 max-w-full rounded-full px-2"
            aria-label={`${name} profile menu`}
          >
            <Avatar>
              <AvatarFallback className="bg-ink text-input">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-28 truncate font-extrabold">{name}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-48 bg-input">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/profile" />}
            nativeButton={false}
          >
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/my-kudos" />}
            nativeButton={false}
          >
            My Kudos
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            render={<Link href="/terms" />}
            nativeButton={false}
          >
            Terms & Conditions
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11"
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
