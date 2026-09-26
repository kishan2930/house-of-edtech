import mongoose from 'mongoose';

import { getServerEnv } from '@/lib/env';

/**
 * Database connection singleton.
 *
 * MONGODB_URI — your connection string from MongoDB Atlas.
 * It tells Mongoose where your database lives (host, user, password, database name).
 * Stored in .env.local so secrets never get committed to git.
 */
function getMongoUri(): string {
  return getServerEnv().MONGODB_URI;
}

/**
 * Cached connection for development hot-reload.
 * Without this cache, every file save in dev would open a new connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * connectDB — opens (or reuses) a single connection to MongoDB.
 * mongoose.connect() returns a promise; we await it before running queries.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
