import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back">
      <SignInForm />
    </AuthShell>
  );
}
