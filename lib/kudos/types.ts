export const kudosTemplates = ['celebration', 'achievement'] as const;
export const reactionTypes = [
  'heart',
  'clap',
  'fire',
  'party',
  'rocket',
] as const;
export const kudosViews = ['wall', 'given', 'received'] as const;

export type KudosTemplate = (typeof kudosTemplates)[number];
export type ReactionType = (typeof reactionTypes)[number];
export type KudosView = (typeof kudosViews)[number];

export type KudosPerson = {
  id: string;
  name: string;
};

export type KudosItem = {
  id: string;
  message: string;
  template: KudosTemplate;
  createdAt: string;
  sender: KudosPerson;
  recipient: KudosPerson;
  reactions: {
    counts: Record<ReactionType, number>;
    mine: ReactionType[];
  };
};
