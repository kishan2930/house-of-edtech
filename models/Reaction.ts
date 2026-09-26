import mongoose, { Schema, model, models } from 'mongoose';

import type { ReactionType } from '@/lib/kudos/types';

const reactionSchema = new Schema(
  {
    kudosId: {
      type: Schema.Types.ObjectId,
      ref: 'Kudos',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['heart', 'clap', 'fire', 'party', 'rocket'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'reactions',
  },
);

reactionSchema.index({ kudosId: 1, userId: 1, type: 1 }, { unique: true });

export type ReactionDocument = {
  _id: mongoose.Types.ObjectId;
  kudosId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
};

export const Reaction =
  (models.Reaction as mongoose.Model<ReactionDocument> | undefined) ??
  model<ReactionDocument>('Reaction', reactionSchema);
