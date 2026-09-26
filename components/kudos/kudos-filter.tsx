'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { KudosSticker } from '@/components/kudos/kudos-sticker';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { KudosPerson } from '@/lib/kudos/list';
import { templateOptions } from '@/lib/kudos/templates';
import type { KudosTemplate } from '@/lib/kudos/types';

export type WallFilter =
  | { kind: 'all' }
  | { kind: 'template'; template: KudosTemplate }
  | { kind: 'person'; person: KudosPerson };

type FilterPanel = 'root' | 'types' | 'users';

export function KudosFilter({
  filter,
  people,
}: {
  filter: WallFilter;
  people: KudosPerson[];
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<FilterPanel>('root');
  const label =
    filter.kind === 'template'
      ? (templateOptions.find((option) => option.key === filter.template)
          ?.label ?? 'Filter')
      : filter.kind === 'person'
        ? filter.person.name
        : 'Filter';

  function showAll() {
    router.push('/', { scroll: false });
  }

  function showTemplate(template: KudosTemplate) {
    router.push(`/?template=${template}`, { scroll: false });
  }

  function showPerson(personId: string) {
    router.push(`/?user=${personId}`, { scroll: false });
  }

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) {
          setPanel('root');
        }
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="max-w-48 rounded-full"
          >
            <span className="truncate">{label}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-48 bg-card">
        {panel === 'root' ? (
          <>
            <DropdownMenuItem
              className={filter.kind === 'all' ? 'font-extrabold' : undefined}
              onClick={showAll}
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => setPanel('types')}
            >
              Types
              <ChevronRight className="ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => setPanel('users')}
            >
              Users
              <ChevronRight className="ml-auto" />
            </DropdownMenuItem>
          </>
        ) : null}
        {panel === 'types' ? (
          <>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => setPanel('root')}
            >
              <ChevronLeft />
              Types
            </DropdownMenuItem>
            {templateOptions.map((option) => (
              <DropdownMenuItem
                key={option.key}
                className={
                  filter.kind === 'template' && filter.template === option.key
                    ? 'font-extrabold'
                    : undefined
                }
                onClick={() => showTemplate(option.key)}
              >
                <KudosSticker src={option.sticker} size={20} />
                {option.label}
              </DropdownMenuItem>
            ))}
          </>
        ) : null}
        {panel === 'users' ? (
          <>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => setPanel('root')}
            >
              <ChevronLeft />
              Users
            </DropdownMenuItem>
            {people.map((person) => (
              <DropdownMenuItem
                key={person.id}
                className={
                  filter.kind === 'person' && filter.person.id === person.id
                    ? 'font-extrabold'
                    : undefined
                }
                onClick={() => showPerson(person.id)}
              >
                {person.name}
              </DropdownMenuItem>
            ))}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
