import { NextResponse } from 'next/server';

import {
  duplicateEmailError,
  isDuplicateKeyError,
  safeServerError,
  validationError,
} from '@/lib/api/errors';
import { hashPassword } from '@/lib/auth/password';
import { connectDB } from '@/lib/db';
import { signUpSchema } from '@/lib/validators/auth';
import { User } from '@/models/User';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Check the highlighted fields.' },
      { status: 400 },
    );
  }

  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await connectDB();

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return duplicateEmailError();
    }

    console.error('Sign up failed:', error);
    return safeServerError();
  }
}
