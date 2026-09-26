import mongoose, { Schema, model, models } from 'mongoose';

import { kudosTemplates, type KudosTemplate } from '@/lib/kudos/types';
import { kudosMessageMax, kudosMessageMin } from '@/lib/validators/kudos';

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
      minlength: kudosMessageMin,
      maxlength: kudosMessageMax,
    },
    template: {
      type: String,
      required: true,
      enum: [...kudosTemplates],
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

const cachedKudos = models.Kudos as mongoose.Model<KudosDocument> | undefined;
const cachedTemplates = cachedKudos?.schema.path('template')?.options.enum;

if (
  cachedKudos &&
  (!Array.isArray(cachedTemplates) ||
    kudosTemplates.some((template) => !cachedTemplates.includes(template)))
) {
  mongoose.deleteModel('Kudos');
}

export const Kudos =
  (models.Kudos as mongoose.Model<KudosDocument> | undefined) ??
  model<KudosDocument>('Kudos', kudosSchema);
