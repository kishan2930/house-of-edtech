'use client';

import { useState, type ReactNode } from 'react';

import { KudosManageDialog } from '@/components/kudos/kudos-manage-dialog';
import { KudosSticker } from '@/components/kudos/kudos-sticker';
import { ReactionBar } from '@/components/kudos/reaction-bar';
import { canEditKudos } from '@/lib/kudos/edit-window';
import { templateOptions } from '@/lib/kudos/templates';
import type { KudosItem, KudosTemplate } from '@/lib/kudos/types';
import { cn } from '@/lib/utils';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const emptyGiver =
  'border border-dashed border-primary-light bg-card text-muted-foreground';
const emptyReceiver = emptyGiver;

export function kudosSurfaceClass(
  template: KudosTemplate | null,
  fill = false,
) {
  const option = templateOptions.find((item) => item.key === template);

  return cn(
    'relative flex w-full flex-col gap-4 overflow-hidden rounded-[12px] border-l-[3px] bg-card p-4 text-card-foreground shadow-card',
    fill ? 'h-full' : 'h-fit',
    option?.surface ?? 'border-l-primary-light',
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second =
    parts.length > 1
      ? (parts[parts.length - 1]?.[0] ?? '')
      : (parts[0]?.[1] ?? '');

  return (first + second).toUpperCase() || '?';
}

function PersonRow({
  name,
  circleClass,
  placeholder,
}: {
  name: string | null;
  circleClass: string;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold',
          name ? circleClass : emptyGiver,
        )}
      >
        {name ? initials(name) : ''}
      </span>
      <span
        className={
          name
            ? 'text-base font-extrabold'
            : 'text-base font-medium text-muted-foreground'
        }
      >
        {name ?? placeholder}
      </span>
    </div>
  );
}

export function KudosCardFace({
  senderName,
  recipientName,
  message,
  template,
  createdAt,
  footer,
  live = false,
  fill = false,
  onActivate,
  activateLabel,
}: {
  senderName: string;
  recipientName: string | null;
  message: string;
  template: KudosTemplate | null;
  createdAt?: string;
  footer?: ReactNode;
  live?: boolean;
  fill?: boolean;
  onActivate?: () => void;
  activateLabel?: string;
}) {
  const selected = templateOptions.find((option) => option.key === template);
  const trimmedMessage = message.trim();
  const giverClass = selected?.giver ?? 'bg-primary text-primary-foreground';
  const receiverClass =
    selected?.receiver ?? 'bg-card text-foreground ring-2 ring-primary-light';

  return (
    <article
      className={kudosSurfaceClass(template, fill)}
      aria-live={live ? 'polite' : undefined}
    >
      {selected ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-44"
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-l to-transparent',
              selected.wash,
            )}
          />
          <KudosSticker
            src={selected.sticker}
            size={120}
            className="absolute top-1 right-1"
            style={{
              maskImage: 'linear-gradient(to left, #000 28%, transparent 88%)',
              WebkitMaskImage:
                'linear-gradient(to left, #000 28%, transparent 88%)',
            }}
          />
        </div>
      ) : null}
      {selected ? <p className="sr-only">{selected.label}</p> : null}
      <CardDetails onActivate={onActivate} activateLabel={activateLabel}>
        <div className="relative flex flex-col gap-1.5 pr-16">
          <PersonRow
            name={senderName}
            circleClass={giverClass}
            placeholder="Your name"
          />
          <p className="pl-[3.125rem] text-sm text-muted-foreground">to</p>
          <PersonRow
            name={recipientName}
            circleClass={nameClass(recipientName, receiverClass)}
            placeholder="Select a teammate"
          />
        </div>
        <blockquote className="relative flex gap-1.5">
          <span
            aria-hidden="true"
            className="pt-0.5 font-serif text-5xl leading-none text-foreground/35"
          >
            “
          </span>
          <p
            className={cn(
              'min-w-0 flex-1 rounded-lg px-3 py-2.5 text-base leading-relaxed font-medium',
              selected?.quote ?? 'bg-primary-bg',
              trimmedMessage ? 'text-card-foreground' : 'text-muted-foreground',
            )}
          >
            {trimmedMessage || 'Write a message'}
          </p>
          <span
            aria-hidden="true"
            className="self-end pb-0.5 font-serif text-5xl leading-none text-foreground/35"
          >
            ”
          </span>
        </blockquote>
        {activateLabel ? (
          <p className="text-sm font-extrabold text-primary">{activateLabel}</p>
        ) : null}
      </CardDetails>
      {createdAt || footer ? (
        <div className="relative mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">{footer}</div>
          {createdAt ? (
            <time
              dateTime={createdAt}
              className="shrink-0 pb-1 text-right font-serif text-sm tracking-wide text-muted-foreground italic"
            >
              {dateFormat.format(new Date(createdAt))}
            </time>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function CardDetails({
  onActivate,
  activateLabel,
  children,
}: {
  onActivate?: () => void;
  activateLabel?: string;
  children: ReactNode;
}) {
  if (!onActivate) {
    return <div className="flex flex-col gap-4">{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={
        activateLabel === 'Delete' ? 'Delete this Kudos' : 'Edit this Kudos'
      }
      className="flex w-full flex-col gap-4 rounded-md text-left outline-none focus-visible:shadow-focus"
    >
      {children}
    </button>
  );
}

function nameClass(name: string | null, circleClass: string) {
  return name ? circleClass : emptyReceiver;
}

export function KudosCard({
  item,
  viewerId,
}: {
  item: KudosItem;
  viewerId?: string;
}) {
  const [open, setOpen] = useState(false);
  const owned = Boolean(viewerId) && item.sender.id === viewerId;
  const editable = owned && canEditKudos(item.createdAt);

  return (
    <>
      <KudosCardFace
        senderName={item.sender.name}
        recipientName={item.recipient.name}
        message={item.message}
        template={item.template}
        createdAt={item.createdAt}
        fill
        onActivate={owned ? () => setOpen(true) : undefined}
        activateLabel={
          owned ? (editable ? 'Edit message' : 'Delete') : undefined
        }
        footer={
          <ReactionBar
            kudosId={item.id}
            counts={item.reactions.counts}
            mine={item.reactions.mine}
          />
        }
      />
      {owned ? (
        <KudosManageDialog
          key={open ? 'open' : 'closed'}
          item={item}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}
