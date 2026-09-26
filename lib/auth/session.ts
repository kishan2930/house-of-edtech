import { auth } from '@/auth';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export async function requireUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  const name = session?.user?.name;
  const email = session?.user?.email;

  if (!id || !name || !email) {
    return null;
  }

  return { id, name, email };
}
