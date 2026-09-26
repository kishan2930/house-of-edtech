import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Auth.js configuration (scaffold only — no real login UI yet).
 *
 * The Credentials provider checks email/password against hardcoded test values.
 * In production you'd verify against your database instead.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        // Placeholder test user — replace with DB lookup later
        if (email === 'test@example.com' && password === 'password') {
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
});
