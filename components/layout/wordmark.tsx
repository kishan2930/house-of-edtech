import { cn } from '@/lib/utils';

const fanCards = [
  { rotation: '-rotate-[24deg]', tone: 'bg-primary' },
  { rotation: '-rotate-12', tone: 'bg-accent' },
  { rotation: 'rotate-0', tone: 'bg-destructive' },
  { rotation: 'rotate-12', tone: 'bg-sky' },
  { rotation: 'rotate-[24deg]', tone: 'bg-input' },
];

function FanCards({ dense = false }: { dense?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 flex items-end justify-center',
        dense ? 'bottom-4' : 'bottom-8',
      )}
    >
      {fanCards.map((card) => (
        <span
          key={card.rotation}
          className={cn(
            'origin-bottom rounded-md border-[1.5px] border-primary-dark shadow-card',
            dense ? 'h-16 w-11 -mx-1' : 'h-24 w-14 -mx-3',
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
  dense = false,
}: {
  decorated?: boolean;
  compact?: boolean;
  dense?: boolean;
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
    <div
      className={cn(
        'mx-auto flex w-fit flex-col items-center',
        dense ? 'gap-2' : 'gap-3',
      )}
    >
      <div
        className={cn(
          'relative flex items-end justify-center overflow-visible',
          dense ? 'h-24 w-64' : 'h-40 w-72',
        )}
      >
        {decorated ? <FanCards dense={dense} /> : null}
        <div className="relative z-10 mb-1 -rotate-3 -skew-x-6 rounded-sm border-[1.5px] border-primary-dark bg-input px-4 py-2 shadow-card">
          <p
            className={cn(
              'skew-x-6 font-extrabold tracking-[0.04em] text-primary-dark',
              dense ? 'text-xl' : 'text-4xl',
            )}
          >
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
