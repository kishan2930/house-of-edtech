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
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
      />
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}
