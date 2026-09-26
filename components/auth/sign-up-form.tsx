'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { AuthField } from '@/components/auth/auth-field';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { signUpSchema } from '@/lib/validators/auth';

type FieldErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirmPassword', string>
>;

export function SignUpForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };
    const parsed = signUpSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if (
          (key === 'name' ||
            key === 'email' ||
            key === 'password' ||
            key === 'confirmPassword') &&
          !nextErrors[key]
        ) {
          nextErrors[key] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (response.ok) {
        router.push('/sign-in');
        return;
      }

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;
      const nextFieldErrors = payload?.fieldErrors ?? {};

      setFieldErrors(nextFieldErrors);
      setFormError(
        Object.keys(nextFieldErrors).length > 0
          ? null
          : (payload?.error ?? 'Something went wrong. Try again.'),
      );
      setPending(false);
    } catch {
      setFormError('Something went wrong. Try again.');
      setPending(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <AuthField
          id="name"
          name="name"
          label="Name"
          type="text"
          autoComplete="name"
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
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
        Sign up
      </Button>
      <p className="text-center text-sm text-foreground">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-extrabold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
