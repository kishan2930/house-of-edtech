import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function fieldErrorsFromZod(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Check the highlighted fields.',
      fieldErrors: fieldErrorsFromZod(error),
    },
    { status: 400 },
  );
}

export function duplicateEmailError() {
  return NextResponse.json(
    {
      error: 'An account with this email already exists.',
      fieldErrors: {
        email: 'An account with this email already exists.',
      },
    },
    { status: 409 },
  );
}

export function safeServerError() {
  return NextResponse.json(
    { error: 'Something went wrong. Try again.' },
    { status: 500 },
  );
}

export function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  if ('code' in error && error.code === 11000) {
    return true;
  }

  if ('cause' in error) {
    return isDuplicateKeyError(error.cause);
  }

  return false;
}
