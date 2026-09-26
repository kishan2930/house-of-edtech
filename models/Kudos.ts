import mongoose, { Schema, model, models } from 'mongoose';

import type { KudosTemplate } from '@/lib/kudos/types';

const kudosSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    template: {
      type: String,
      required: true,
      enum: ['celebration', 'achievement'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'kudos',
  },
);

kudosSchema.index({ createdAt: -1 });
kudosSchema.index({ senderId: 1, createdAt: -1 });
kudosSchema.index({ recipientId: 1, createdAt: -1 });

export type KudosDocument = {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  message: string;
  template: KudosTemplate;
  createdAt: Date;
};

export const Kudos =
  (models.Kudos as mongoose.Model<KudosDocument> | undefined) ??
  model<KudosDocument>('Kudos', kudosSchema);
