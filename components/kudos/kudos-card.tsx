import { cn } from '@/lib/utils';
import { templateOptions } from '@/lib/kudos/templates';
import type { KudosItem, KudosTemplate } from '@/lib/kudos/types';

import { ReactionBar } from '@/components/kudos/reaction-bar';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function kudosSurfaceClass(template: KudosTemplate | null) {
  return cn(
    'flex flex-col gap-3 rounded-[12px] border-l-[3px] bg-card p-4 text-card-foreground shadow-card',
    template === 'celebration' &&
      'border-l-accent bg-gradient-to-br from-accent-light/50 to-card shadow-accent-glow dark:from-accent/25',
    template === 'achievement' &&
      'border-l-primary bg-gradient-to-br from-primary-bg to-card shadow-teal-glow',
    template === null && 'border-l-primary-light',
  );
}

export function KudosCard({ item }: { item: KudosItem }) {
  const template = templateOptions.find(
    (option) => option.key === item.template,
  );

  return (
    <article className={kudosSurfaceClass(item.template)}>
      {template ? (
        <p className="inline-flex w-fit items-center gap-1 rounded-full bg-input px-2.5 py-1 text-sm font-extrabold">
          <span aria-hidden="true">{template.emoji}</span>
          {template.label}
        </p>
      ) : null}
      <p className="text-sm font-medium">
        <span className="font-extrabold">{item.sender.name}</span>
        <span aria-hidden="true"> → </span>
        <span className="sr-only"> to </span>
        <span className="font-extrabold">{item.recipient.name}</span>
      </p>
      <p className="text-lg font-extrabold leading-snug">“{item.message}”</p>
      <time dateTime={item.createdAt} className="text-sm text-muted-foreground">
        {dateFormat.format(new Date(item.createdAt))}
      </time>
      <ReactionBar
        kudosId={item.id}
        counts={item.reactions.counts}
        mine={item.reactions.mine}
      />
    </article>
  );
}
