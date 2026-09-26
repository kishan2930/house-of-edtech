import { NextResponse } from 'next/server';

import { notFoundError, safeServerError, unauthorized } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { reactionSummaryFor } from '@/lib/kudos/serialize';
import { isObjectId } from '@/lib/validators/kudos';
import { isReactionType } from '@/lib/validators/reaction';
import { Kudos } from '@/models/Kudos';
import { Reaction } from '@/models/Reaction';

type RouteContext = {
  params: Promise<{ id: string; type: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    return unauthorized();
  }

  const { id, type } = await context.params;

  if (!isObjectId(id) || !isReactionType(type)) {
    return NextResponse.json(
      { error: 'Check the highlighted fields.' },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const kudos = await Kudos.findById(id).select('_id');

    if (!kudos) {
      return notFoundError();
    }

    await Reaction.deleteOne({
      kudosId: id,
      userId: sessionUser.id,
      type,
    });

    const reactions = await reactionSummaryFor(id, sessionUser.id);
    return NextResponse.json({ reactions });
  } catch (error) {
    console.error('Failed to remove a reaction:', error);
    return safeServerError();
  }
}
