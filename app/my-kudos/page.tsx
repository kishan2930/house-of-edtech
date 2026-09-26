import { PageHeading } from '@/components/layout/page-heading';

export default function MyKudosPage() {
  return (
    <PageHeading title="My Kudos">
      <p className="text-base text-foreground">
        Kudos you have given and received will show here.
      </p>
    </PageHeading>
  );
}
