import { NextResponse } from 'next/server';

import { notFoundError, safeServerError, unauthorized } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    return unauthorized();
  }

  try {
    await connectDB();

    const user = await User.findById(sessionUser.id).select(
      'name email createdAt',
    );

    if (!user) {
      return notFoundError();
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to load the current user:', error);
    return safeServerError();
  }
}
