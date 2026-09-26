import { NextResponse } from 'next/server';

import { safeServerError, unauthorized } from '@/lib/api/errors';
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

    const users = await User.find({ _id: { $ne: sessionUser.id } })
      .select('name')
      .sort({ name: 1 });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
      })),
    });
  } catch (error) {
    console.error('Failed to list users:', error);
    return safeServerError();
  }
}
