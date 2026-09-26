import { reactionTypes, type ReactionType } from '@/lib/kudos/types';

export { reactionTypes };

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
