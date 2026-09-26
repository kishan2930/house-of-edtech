import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      lede="Sign in to read the wall and leave a note for a teammate."
    >
      <SignInForm />
    </AuthShell>
  );
}
