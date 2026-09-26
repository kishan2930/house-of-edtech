import { redirect } from 'next/navigation';

import { PageHeading } from '@/components/layout/page-heading';
import { requireUser } from '@/lib/auth/session';

const sections = [
  {
    title: 'Be kind',
    body: 'Kudos Wall is for recognizing teammates. Write something you would be glad for them to read.',
  },
  {
    title: 'No harassment',
    body: 'Do not insult, threaten, or harass anyone.',
  },
  {
    title: 'Removal',
    body: 'The company may remove Kudos that break this standard.',
  },
];

export default async function TermsPage() {
  const user = await requireUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <PageHeading title="Terms & Conditions">
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="border-b border-dashed border-primary-light pb-2 text-lg font-extrabold tracking-[0.04em] text-foreground">
              {section.title}
            </h2>
            <p className="text-base text-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </PageHeading>
  );
}
