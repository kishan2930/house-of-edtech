import { reactionOptions } from '@/lib/kudos/reactions';
import type { ReactionType } from '@/lib/kudos/types';

export function ReactionBar({
  counts,
}: {
  counts: Record<ReactionType, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Reactions">
      {reactionOptions.map((reaction) => (
        <button
          key={reaction.key}
          type="button"
          disabled
          aria-label={`${reaction.name}, ${counts[reaction.key]}`}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-border bg-input px-3 text-sm font-extrabold text-primary-dark disabled:opacity-80"
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          <span>{counts[reaction.key]}</span>
        </button>
      ))}
    </div>
  );
}
