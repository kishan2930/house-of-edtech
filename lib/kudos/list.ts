import { connectDB } from '@/lib/db';
import { serializeKudosList } from '@/lib/kudos/serialize';
import type { KudosItem, KudosView } from '@/lib/kudos/types';
import { Kudos } from '@/models/Kudos';

export async function listKudos(
  userId: string,
  view: KudosView,
): Promise<{ kudos: KudosItem[] }> {
  await connectDB();

  const filter =
    view === 'given'
      ? { senderId: userId }
      : view === 'received'
        ? { recipientId: userId }
        : {};

  const docs = await Kudos.find(filter).sort({ createdAt: -1 }).limit(50);

  return { kudos: await serializeKudosList(docs) };
}

export async function getKudos(id: string): Promise<KudosItem | null> {
  await connectDB();

  const doc = await Kudos.findById(id);

  if (!doc) {
    return null;
  }

  const [kudos] = await serializeKudosList([doc]);
  return kudos ?? null;
}
