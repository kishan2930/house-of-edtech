/**
 * Database connection singleton (stub for Phase 3).
 *
 * Why a singleton?
 * - In serverless/dev, Next.js may reload modules often.
 * - Opening a new DB connection on every request is slow and can hit connection limits.
 * - We create ONE shared connection and reuse it across requests.
 *
 * Phase 3 will replace this stub with a real Mongoose connection using MONGODB_URI
 * from .env.local (your secret connection string — never committed to git).
 */

export async function connectDB(): Promise<void> {
  // Placeholder — implemented in Phase 3
  throw new Error('Database not configured yet. Complete Phase 3 setup.');
}
