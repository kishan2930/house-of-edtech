'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { canEditKudos } from '@/lib/kudos/edit-window';
import type { KudosItem } from '@/lib/kudos/types';
import { cn } from '@/lib/utils';
import { kudosMessageMax, parseUpdateKudos } from '@/lib/validators/kudos';

export function KudosManageDialog({
  item,
  open,
  onOpenChange,
}: {
  item: KudosItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const editable = canEditKudos(item.createdAt);
  const [message, setMessage] = useState(item.message);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, setPending] = useState<'save' | 'delete' | null>(null);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!canEditKudos(item.createdAt)) {
      setFormError('You can edit a message for 30 minutes after you send it.');
      return;
    }

    const parsed = parseUpdateKudos({ message });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Check the message.');
      return;
    }

    setFieldError(null);
    setPending('save');

    try {
      const response = await fetch(`/api/kudos/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: { message?: string };
      } | null;

      if (!response.ok) {
        setFieldError(payload?.fieldErrors?.message ?? null);
        setFormError(
          payload?.fieldErrors?.message
            ? null
            : (payload?.error ?? 'Something went wrong. Try again.'),
        );
        setPending(null);
        return;
      }

      onOpenChange(false);
      router.refresh();
    } catch {
      setFormError('Something went wrong. Try again.');
      setPending(null);
    }
  }

  async function onDelete() {
    setFormError(null);
    setPending('delete');

    try {
      const response = await fetch(`/api/kudos/${item.id}`, {
        method: 'DELETE',
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setFormError(payload?.error ?? 'Something went wrong. Try again.');
        setPending(null);
        return;
      }

      onOpenChange(false);
      router.refresh();
    } catch {
      setFormError('Something went wrong. Try again.');
      setPending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-base text-card-foreground sm:max-w-lg">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-extrabold tracking-[0.04em]">
            {editable ? 'Edit Kudos' : 'Delete Kudos'}
          </DialogTitle>
          <DialogDescription>
            {editable
              ? 'You can change the message for 30 minutes after you send it.'
              : 'The 30 minutes to edit this message have passed. You can still delete it.'}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5" noValidate onSubmit={onSave}>
          <Field data-invalid={Boolean(fieldError)}>
            <FieldLabel htmlFor={`kudos-edit-${item.id}`}>Message</FieldLabel>
            <Textarea
              id={`kudos-edit-${item.id}`}
              value={message}
              maxLength={kudosMessageMax}
              disabled={!editable || pending !== null}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={`kudos-edit-count-${item.id}`}
              onChange={(event) => {
                setMessage(event.target.value);
                setFieldError(null);
              }}
            />
            <FieldDescription
              id={`kudos-edit-count-${item.id}`}
              className={cn(
                'text-right',
                kudosMessageMax - message.length === 0 &&
                  'font-extrabold text-destructive',
              )}
            >
              {message.length} written, {kudosMessageMax - message.length} left
            </FieldDescription>
            <FieldError>{fieldError}</FieldError>
          </Field>
          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3">
            {editable ? (
              <Button
                type="submit"
                variant="gold"
                size="cta"
                className="w-full"
                disabled={pending !== null || message.trim() === item.message}
              >
                {pending === 'save' ? (
                  <Spinner data-icon="inline-start" />
                ) : null}
                Save message
              </Button>
            ) : null}
            {confirmDelete ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Delete this Kudos?</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    disabled={pending !== null}
                    onClick={onDelete}
                  >
                    {pending === 'delete' ? (
                      <Spinner data-icon="inline-start" />
                    ) : null}
                    Delete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={pending !== null}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Keep it
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={pending !== null}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
