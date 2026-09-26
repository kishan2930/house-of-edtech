import { cn } from '@/lib/utils';

const fanCards = [
  { rotation: '-rotate-[24deg]', tone: 'bg-primary' },
  { rotation: '-rotate-12', tone: 'bg-accent' },
  { rotation: 'rotate-0', tone: 'bg-destructive' },
  { rotation: 'rotate-12', tone: 'bg-sky' },
  { rotation: 'rotate-[24deg]', tone: 'bg-input' },
];

function FanCards() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-8 flex items-end justify-center"
    >
      {fanCards.map((card) => (
        <span
          key={card.rotation}
          className={cn(
            'h-24 w-14 origin-bottom -mx-3 rounded-md border-[1.5px] border-primary-dark shadow-card',
            card.rotation,
            card.tone,
          )}
        />
      ))}
    </div>
  );
}

export function Wordmark({
  decorated = false,
  compact = false,
}: {
  decorated?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span className="inline-flex -rotate-2 -skew-x-6 rounded-sm border-[1.5px] border-primary-dark bg-input px-2.5 py-1 shadow-card">
        <span className="skew-x-6 text-sm font-extrabold tracking-[0.04em] text-primary-dark">
          Kudos Wall
        </span>
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-40 w-72 items-end justify-center">
        {decorated ? <FanCards /> : null}
        <div className="relative z-10 mb-1 -rotate-3 -skew-x-6 rounded-sm border-[1.5px] border-primary-dark bg-input px-4 py-2 shadow-card">
          <p className="skew-x-6 text-4xl font-extrabold tracking-[0.04em] text-primary-dark">
            Kudos Wall
          </p>
        </div>
      </div>
      {decorated ? (
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-1 -left-2 -z-10 h-[calc(100%-4px)] w-3 border-[1.5px] border-primary-dark bg-primary-bg"
          />
          <span
            aria-hidden
            className="absolute top-1 -right-2 -z-10 h-[calc(100%-4px)] w-3 border-[1.5px] border-primary-dark bg-primary-bg"
          />
          <p className="relative border-[1.5px] border-primary-dark bg-input px-5 py-1 text-sm font-extrabold tracking-[0.08em] text-primary-dark">
            Recognize someone
          </p>
        </div>
      ) : null}
    </div>
  );
}
