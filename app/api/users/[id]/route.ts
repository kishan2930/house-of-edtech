import { NextResponse } from 'next/server';

import { notFoundError, safeServerError, unauthorized } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { isObjectId } from '@/lib/validators/kudos';
import { User } from '@/models/User';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    return unauthorized();
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return NextResponse.json(
      { error: 'Check the highlighted fields.' },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const user = await User.findById(id).select('name');

    if (!user) {
      return notFoundError();
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Failed to load user:', error);
    return safeServerError();
  }
}
