import { emptyReactions, summarizeReactions } from '@/lib/kudos/reactions';
import type { KudosItem } from '@/lib/kudos/types';
import { connectDB } from '@/lib/db';
import { Reaction } from '@/models/Reaction';
import { User } from '@/models/User';
import type { KudosDocument } from '@/models/Kudos';

export { emptyReactions };

export function serializeKudos(
  doc: KudosDocument,
  names: Map<string, string>,
  reactions: KudosItem['reactions'] = emptyReactions(),
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
    reactions,
  };
}

export async function reactionSummaryFor(kudosId: string, userId: string) {
  const summaries = await loadReactionSummaries([kudosId], userId);
  return summaries.get(kudosId) ?? emptyReactions();
}

export async function serializeKudosList(
  docs: KudosDocument[],
  userId: string,
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
  const kudosIds = docs.map((doc) => doc._id.toString());
  const [people, summaries] = await Promise.all([
    User.find({ _id: { $in: ids } }).select('name'),
    loadReactionSummaries(kudosIds, userId),
  ]);
  const names = new Map(
    people.map((person) => [person._id.toString(), person.name]),
  );

  return docs.map((doc) =>
    serializeKudos(
      doc,
      names,
      summaries.get(doc._id.toString()) ?? emptyReactions(),
    ),
  );
}

async function loadReactionSummaries(kudosIds: string[], userId: string) {
  await connectDB();

  const rows = await Reaction.find({ kudosId: { $in: kudosIds } }).select(
    'kudosId userId type',
  );

  return summarizeReactions(
    rows.map((row) => ({
      kudosId: row.kudosId.toString(),
      userId: row.userId.toString(),
      type: row.type,
    })),
    userId,
    kudosIds,
  );
}
