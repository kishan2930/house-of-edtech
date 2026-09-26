'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { KudosPreview } from '@/components/kudos/kudos-preview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { templateOptions } from '@/lib/kudos/templates';
import type { KudosTemplate } from '@/lib/kudos/types';
import { createKudosSchema } from '@/lib/validators/kudos';

type Teammate = {
  id: string;
  name: string;
};

type FieldErrors = Partial<
  Record<'recipientId' | 'message' | 'template', string>
>;

type UsersStatus = 'idle' | 'loading' | 'ready' | 'error';

export function CreateKudosDialog({ senderName }: { senderName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<Teammate[]>([]);
  const [usersStatus, setUsersStatus] = useState<UsersStatus>('idle');
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [template, setTemplate] = useState<KudosTemplate | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    fetch('/api/users')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Could not load teammates');
        }

        return (await response.json()) as { users?: Teammate[] };
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setUsers(payload.users ?? []);
        setUsersStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setUsersStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  function resetForm() {
    setRecipientId(null);
    setMessage('');
    setTemplate(null);
    setFieldErrors({});
    setFormError(null);
    setPending(false);
  }

  function onOpenChange(next: boolean) {
    setOpen(next);

    if (next) {
      setUsersStatus('loading');
      return;
    }

    resetForm();
  }

  const recipientName =
    users.find((user) => user.id === recipientId)?.name ?? null;
  const selectItems = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = createKudosSchema.safeParse({
      recipientId: recipientId ?? '',
      message,
      template,
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if (
          (key === 'recipientId' || key === 'message' || key === 'template') &&
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
      const response = await fetch('/api/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;

      if (!response.ok) {
        const nextFieldErrors = payload?.fieldErrors ?? {};
        setFieldErrors(nextFieldErrors);
        setFormError(
          Object.keys(nextFieldErrors).length > 0
            ? null
            : (payload?.error ?? 'Something went wrong. Try again.'),
        );
        setPending(false);
        return;
      }

      resetForm();
      setOpen(false);
      router.refresh();
    } catch {
      setFormError('Something went wrong. Try again.');
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="gold" size="cta">
            Create Kudos
          </Button>
        }
      />
      <DialogContent className="max-h-[min(90dvh,44rem)] overflow-y-auto overscroll-contain bg-card text-base text-card-foreground sm:max-w-3xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-extrabold tracking-[0.04em]">
            Create Kudos
          </DialogTitle>
          <DialogDescription className="sr-only">
            Recognize a teammate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <KudosPreview
            senderName={senderName}
            recipientName={recipientName}
            message={message}
            template={template}
          />
          <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={Boolean(fieldErrors.recipientId)}>
                <FieldLabel htmlFor="kudos-recipient">Give Kudos to</FieldLabel>
                {usersStatus === 'loading' || usersStatus === 'idle' ? (
                  <Skeleton className="h-11 w-full rounded-[8px]" />
                ) : null}
                {usersStatus === 'error' ? (
                  <FieldError>Something went wrong. Try again.</FieldError>
                ) : null}
                {usersStatus === 'ready' && users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No other teammates yet. Invite them to sign up.
                  </p>
                ) : null}
                {usersStatus === 'ready' && users.length > 0 ? (
                  <Select
                    items={selectItems}
                    value={recipientId}
                    onValueChange={(value) => {
                      setRecipientId(value);
                      setFieldErrors((current) => ({
                        ...current,
                        recipientId: undefined,
                      }));
                    }}
                    modal={false}
                  >
                    <SelectTrigger
                      id="kudos-recipient"
                      className="w-full"
                      aria-invalid={Boolean(fieldErrors.recipientId)}
                      disabled={pending}
                    >
                      <SelectValue placeholder="Select a teammate" />
                    </SelectTrigger>
                    <SelectContent className="z-[70]">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
                <FieldError>{fieldErrors.recipientId}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.message)}>
                <FieldLabel htmlFor="kudos-message">Message</FieldLabel>
                <Textarea
                  id="kudos-message"
                  name="message"
                  value={message}
                  maxLength={500}
                  disabled={pending}
                  aria-invalid={Boolean(fieldErrors.message)}
                  placeholder="Write a message"
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      message: undefined,
                    }));
                  }}
                />
                <FieldError>{fieldErrors.message}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.template)}>
                <FieldLabel id="kudos-template-label">Template</FieldLabel>
                <ToggleGroup
                  aria-labelledby="kudos-template-label"
                  className="grid w-full grid-cols-2"
                  value={template ? [template] : []}
                  disabled={pending}
                  onValueChange={(groupValue) => {
                    const next = groupValue.find(
                      (value): value is KudosTemplate =>
                        value === 'celebration' || value === 'achievement',
                    );

                    if (!next) {
                      return;
                    }

                    setTemplate(next);
                    setFieldErrors((current) => ({
                      ...current,
                      template: undefined,
                    }));
                  }}
                >
                  {templateOptions.map((option) => (
                    <ToggleGroupItem
                      key={option.key}
                      value={option.key}
                      variant="outline"
                      className={
                        option.key === 'celebration'
                          ? 'h-11 min-h-11 rounded-full border-border bg-input text-base font-extrabold text-primary-dark data-pressed:border-accent-dark data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:shadow-accent-glow'
                          : 'h-11 min-h-11 rounded-full border-border bg-input text-base font-extrabold text-primary-dark data-pressed:border-ink data-pressed:bg-ink data-pressed:text-input data-pressed:shadow-teal-glow'
                      }
                    >
                      <span aria-hidden="true">{option.emoji}</span>
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldError>{fieldErrors.template}</FieldError>
              </Field>
            </FieldGroup>
            {formError ? (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="gold"
              size="cta"
              className="w-full"
              disabled={
                pending || usersStatus !== 'ready' || users.length === 0
              }
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Create Kudos
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
