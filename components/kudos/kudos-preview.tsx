import { kudosSurfaceClass } from '@/components/kudos/kudos-card';
import { templateOptions } from '@/lib/kudos/templates';
import type { KudosTemplate } from '@/lib/kudos/types';

export function KudosPreview({
  senderName,
  recipientName,
  message,
  template,
}: {
  senderName: string;
  recipientName: string | null;
  message: string;
  template: KudosTemplate | null;
}) {
  const selected = templateOptions.find((option) => option.key === template);
  const trimmedMessage = message.trim();
  const hasRecipient = Boolean(recipientName);

  return (
    <article className={kudosSurfaceClass(template)} aria-live="polite">
      {selected ? (
        <p className="inline-flex w-fit items-center gap-1 rounded-full bg-input px-2.5 py-1 text-sm font-extrabold">
          <span aria-hidden="true">{selected.emoji}</span>
          {selected.label}
        </p>
      ) : null}
      <p
        className={
          hasRecipient
            ? 'text-sm font-medium'
            : 'text-sm font-medium text-muted-foreground'
        }
      >
        {hasRecipient ? (
          <>
            <span className="font-extrabold">{senderName}</span>
            <span aria-hidden="true"> → </span>
            <span className="sr-only"> to </span>
            <span className="font-extrabold">{recipientName}</span>
          </>
        ) : (
          'Select a teammate'
        )}
      </p>
      <p
        className={
          trimmedMessage
            ? 'text-lg font-extrabold leading-snug'
            : 'text-lg font-medium leading-snug text-muted-foreground'
        }
      >
        {trimmedMessage ? `“${trimmedMessage}”` : 'Write a message'}
      </p>
    </article>
  );
}
