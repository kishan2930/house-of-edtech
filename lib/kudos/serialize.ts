import {
  reactionTypes,
  type KudosItem,
  type ReactionType,
} from '@/lib/kudos/types';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import type { KudosDocument } from '@/models/Kudos';

export function emptyReactions(): KudosItem['reactions'] {
  const counts = {} as Record<ReactionType, number>;

  for (const type of reactionTypes) {
    counts[type] = 0;
  }

  return { counts, mine: [] };
}

export function serializeKudos(
  doc: KudosDocument,
  names: Map<string, string>,
): KudosItem {
  const senderId = doc.senderId.toString();
  const recipientId = doc.recipientId.toString();

  return {
    id: doc._id.toString(),
    message: doc.message,
    template: doc.template,
    createdAt: doc.createdAt.toISOString(),
    sender: {
      id: senderId,
      name: names.get(senderId) ?? 'Teammate',
    },
    recipient: {
      id: recipientId,
      name: names.get(recipientId) ?? 'Teammate',
    },
    reactions: emptyReactions(),
  };
}

export async function serializeKudosList(
  docs: KudosDocument[],
): Promise<KudosItem[]> {
  if (docs.length === 0) {
    return [];
  }

  await connectDB();

  const ids = [
    ...new Set(
      docs.flatMap((doc) => [
        doc.senderId.toString(),
        doc.recipientId.toString(),
      ]),
    ),
  ];
  const people = await User.find({ _id: { $in: ids } }).select('name');
  const names = new Map(
    people.map((person) => [person._id.toString(), person.name]),
  );

  return docs.map((doc) => serializeKudos(doc, names));
}
