import mongoose, { Schema, models, model } from 'mongoose';

/**
 * Placeholder model — proves the DB connection works.
 *
 * A Mongoose "Schema" defines allowed fields and types for documents
 * in a MongoDB "collection" (like a table in SQL, but document-based).
 */
const placeholderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'placeholders',
  },
);

export type PlaceholderDocument = mongoose.InferSchemaType<
  typeof placeholderSchema
>;

/**
 * Reuse existing model in dev to avoid "Cannot overwrite model" errors on hot reload.
 */
export const Placeholder =
  models.Placeholder ?? model('Placeholder', placeholderSchema);
