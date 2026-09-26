import { KudosCardFace } from '@/components/kudos/kudos-card';
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
  return (
    <KudosCardFace
      senderName={senderName}
      recipientName={recipientName}
      message={message}
      template={template}
      live
    />
  );
}
