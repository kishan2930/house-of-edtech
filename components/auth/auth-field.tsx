'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  autoComplete: string;
  error?: string;
};

export function AuthField({
  id,
  name,
  label,
  type,
  autoComplete,
  error,
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={isPassword && visible ? 'text' : type}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          className={isPassword ? 'pr-12' : undefined}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
            className="absolute top-0 right-0 inline-flex size-11 items-center justify-center rounded-[8px] text-primary-dark outline-none hover:text-foreground focus-visible:shadow-focus focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {visible ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}
