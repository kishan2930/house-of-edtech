export { auth as middleware } from '@/auth';

/**
 * Optional auth middleware scaffold.
 * Currently matches all routes but does not block unauthenticated users.
 * Uncomment the authorized callback in auth.ts when you want route protection.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
