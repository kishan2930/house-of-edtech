'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { AuthField } from '@/components/auth/auth-field';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { signInSchema } from '@/lib/validators/auth';

type FieldErrors = Partial<Record<'email' | 'password', string>>;

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };
    const parsed = signInSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if ((key === 'email' || key === 'password') && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      const result = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        setFormError('Email or password is incorrect.');
        setPending(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setFormError('Something went wrong. Try again.');
      setPending(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
      <FieldGroup className="gap-3">
        <AuthField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <AuthField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={fieldErrors.password}
        />
      </FieldGroup>
      {formError ? <FieldError errors={[{ message: formError }]} /> : null}
      <Button
        type="submit"
        variant="gold"
        size="cta"
        className="w-full"
        disabled={pending}
      >
        {pending ? <Spinner data-icon="inline-start" /> : null}
        Sign in
      </Button>
      <p className="text-center text-sm text-foreground">
        Don’t have an account?{' '}
        <Link
          href="/sign-up"
          className="font-extrabold text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
