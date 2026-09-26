import {
  reactionTypes,
  type KudosItem,
  type ReactionType,
} from '@/lib/kudos/types';

export { reactionTypes };

export function emptyReactions(): KudosItem['reactions'] {
  const counts = {} as Record<ReactionType, number>;

  for (const type of reactionTypes) {
    counts[type] = 0;
  }

  return { counts, mine: [] };
}

export function summarizeReactions(
  rows: { kudosId: string; userId: string; type: ReactionType }[],
  viewerId: string,
  kudosIds: string[],
) {
  const summaries = new Map<string, KudosItem['reactions']>();

  for (const id of kudosIds) {
    summaries.set(id, emptyReactions());
  }

  for (const row of rows) {
    const summary = summaries.get(row.kudosId);

    if (!summary) {
      continue;
    }

    summary.counts[row.type] += 1;

    if (row.userId === viewerId && !summary.mine.includes(row.type)) {
      summary.mine.push(row.type);
    }
  }

  for (const summary of summaries.values()) {
    summary.mine = reactionTypes.filter((type) => summary.mine.includes(type));
  }

  return summaries;
}

export const reactionOptions: {
  key: ReactionType;
  emoji: string;
  name: string;
}[] = [
  { key: 'heart', emoji: '❤️', name: 'Love' },
  { key: 'clap', emoji: '👏', name: 'Clap' },
  { key: 'fire', emoji: '🔥', name: 'Fire' },
  { key: 'party', emoji: '🎉', name: 'Celebrate' },
  { key: 'rocket', emoji: '🚀', name: 'Rocket' },
];
