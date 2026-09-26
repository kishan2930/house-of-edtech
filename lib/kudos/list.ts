import { connectDB } from '@/lib/db';
import { serializeKudosList } from '@/lib/kudos/serialize';
import type { KudosItem, KudosTemplate, KudosView } from '@/lib/kudos/types';
import { Kudos } from '@/models/Kudos';
import { User } from '@/models/User';

export type KudosPerson = {
  id: string;
  name: string;
};

type KudosListOptions = {
  template?: KudosTemplate;
  personId?: string;
};

export async function listPeople(): Promise<KudosPerson[]> {
  await connectDB();

  const users = await User.find().select('name');

  return users
    .map((user) => ({
      id: user._id.toString(),
      name: user.name,
    }))
    .toSorted((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
}

export async function listKudos(
  userId: string,
  view: KudosView,
  options: KudosListOptions = {},
): Promise<{ kudos: KudosItem[] }> {
  await connectDB();

  const filter: {
    senderId?: string;
    recipientId?: string;
    template?: KudosTemplate;
    $or?: Array<{ senderId: string } | { recipientId: string }>;
  } =
    view === 'given'
      ? { senderId: userId }
      : view === 'received'
        ? { recipientId: userId }
        : {};

  if (options.personId) {
    filter.$or = [
      { senderId: options.personId },
      { recipientId: options.personId },
    ];
  }

  if (options.template) {
    filter.template = options.template;
  }

  const docs = await Kudos.find(filter).sort({ createdAt: -1 }).limit(50);

  return { kudos: await serializeKudosList(docs, userId) };
}

export async function getKudos(
  id: string,
  userId: string,
): Promise<KudosItem | null> {
  await connectDB();

  const doc = await Kudos.findById(id);

  if (!doc) {
    return null;
  }

  const [kudos] = await serializeKudosList([doc], userId);
  return kudos ?? null;
}
