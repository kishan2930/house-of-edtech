import { handlers } from '@/auth';

/**
 * Auth.js API route — handles sign-in, sign-out, session, and callbacks.
 * All auth endpoints live under /api/auth/* (e.g. /api/auth/providers).
 */
export const { GET, POST } = handlers;
