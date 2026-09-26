import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      lede="Create your account, then sign in. Your session starts after you sign in."
    >
      <SignUpForm />
    </AuthShell>
  );
}
