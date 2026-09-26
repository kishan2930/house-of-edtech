'use client';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto flex w-full max-w-3xl px-4 py-12">
      <Empty className="border border-dashed border-primary-light bg-card shadow-card">
        <EmptyHeader>
          <EmptyTitle className="font-extrabold text-foreground">
            Something went wrong.
          </EmptyTitle>
          <EmptyDescription>Try again.</EmptyDescription>
        </EmptyHeader>
        <Button type="button" variant="gold" size="cta" onClick={() => reset()}>
          Try again
        </Button>
      </Empty>
    </section>
  );
}
