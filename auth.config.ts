import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

import { getServerEnv } from '@/lib/env';

const protectedPaths = ['/', '/profile', '/my-kudos', '/terms'];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Edge-safe Auth.js config used by middleware.
 * Database lookups stay in auth.ts so mongoose is not bundled into middleware.
 */
export const authConfig = {
  secret: getServerEnv().AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

      if (isAuthPage) {
        if (isLoggedIn) {
          return NextResponse.redirect(new URL('/', request.nextUrl));
        }

        return true;
      }

      if (!isProtectedPath(pathname)) {
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
