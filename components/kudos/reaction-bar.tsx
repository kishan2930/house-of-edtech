'use client';

import { useState } from 'react';

import { reactionOptions, reactionTypes } from '@/lib/kudos/reactions';
import type { KudosItem, ReactionType } from '@/lib/kudos/types';
import { cn } from '@/lib/utils';

export function ReactionBar({
  kudosId,
  counts,
  mine,
}: {
  kudosId: string;
  counts: KudosItem['reactions']['counts'];
  mine: ReactionType[];
}) {
  const [reactions, setReactions] = useState({ counts, mine });
  const [pending, setPending] = useState<ReactionType[]>([]);

  async function onToggle(type: ReactionType) {
    if (pending.includes(type)) {
      return;
    }

    const selected = reactions.mine.includes(type);
    setPending((current) => [...current, type]);

    try {
      const response = await fetch(
        selected
          ? `/api/kudos/${kudosId}/reactions/${type}`
          : `/api/kudos/${kudosId}/reactions`,
        selected
          ? { method: 'DELETE' }
          : {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type }),
            },
      );

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        reactions?: KudosItem['reactions'];
      };

      if (!payload.reactions) {
        return;
      }

      const summary = payload.reactions;
      setReactions((current) => {
        const nextMine = new Set(current.mine);

        if (summary.mine.includes(type)) {
          nextMine.add(type);
        } else {
          nextMine.delete(type);
        }

        return {
          counts: {
            ...current.counts,
            [type]: summary.counts[type],
          },
          mine: reactionTypes.filter((item) => nextMine.has(item)),
        };
      });
    } finally {
      setPending((current) => current.filter((item) => item !== type));
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Reactions">
      {reactionOptions.map((reaction) => {
        const selected = reactions.mine.includes(reaction.key);
        const busy = pending.includes(reaction.key);

        return (
          <button
            key={reaction.key}
            type="button"
            aria-pressed={selected}
            aria-label={`${reaction.name}, ${reactions.counts[reaction.key]}`}
            disabled={busy}
            onClick={() => onToggle(reaction.key)}
            className={cn(
              'inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-border bg-input px-3 text-sm font-extrabold text-primary-dark transition-colors outline-none focus-visible:shadow-focus focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 motion-reduce:active:scale-100 disabled:opacity-70',
              'aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-input aria-pressed:shadow-teal-glow',
            )}
          >
            <span aria-hidden="true">{reaction.emoji}</span>
            <span>{reactions.counts[reaction.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
