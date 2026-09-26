import { z } from 'zod';

import { reactionTypes } from '@/lib/kudos/reactions';
import type { ReactionType } from '@/lib/kudos/types';

export const addReactionSchema = z.object({
  type: z.enum(reactionTypes, { error: 'Choose a reaction.' }),
});

export function isReactionType(value: string): value is ReactionType {
  return reactionTypes.some((type) => type === value);
}
