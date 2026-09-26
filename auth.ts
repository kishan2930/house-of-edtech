import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authConfig } from '@/auth.config';
import { verifyPassword } from '@/lib/auth/password';
import { connectDB } from '@/lib/db';
import { signInSchema } from '@/lib/validators/auth';
import { User } from '@/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: parsed.data.email }).select(
            '+passwordHash',
          );

          if (!user) {
            return null;
          }

          const passwordMatches = await verifyPassword(
            parsed.data.password,
            user.passwordHash,
          );

          if (!passwordMatches) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('Sign in failed:', error);
          return null;
        }
      },
    }),
  ],
});
