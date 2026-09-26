import { NextResponse } from 'next/server';

import {
  isDuplicateKeyError,
  notFoundError,
  safeServerError,
  unauthorized,
  validationError,
} from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { reactionSummaryFor } from '@/lib/kudos/serialize';
import { addReactionSchema } from '@/lib/validators/reaction';
import { isObjectId } from '@/lib/validators/kudos';
import { Kudos } from '@/models/Kudos';
import { Reaction } from '@/models/Reaction';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Check the highlighted fields.' },
      { status: 400 },
    );
  }

  const parsed = addReactionSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    await connectDB();

    const kudos = await Kudos.findById(id).select('_id');

    if (!kudos) {
      return notFoundError();
    }

    const existing = await Reaction.findOne({
      kudosId: id,
      userId: sessionUser.id,
      type: parsed.data.type,
    }).select('_id');

    if (existing) {
      const reactions = await reactionSummaryFor(id, sessionUser.id);
      return NextResponse.json({ reactions });
    }

    let created = true;

    try {
      await Reaction.create({
        kudosId: id,
        userId: sessionUser.id,
        type: parsed.data.type,
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }

      created = false;
    }

    const reactions = await reactionSummaryFor(id, sessionUser.id);

    return NextResponse.json({ reactions }, { status: created ? 201 : 200 });
  } catch (error) {
    console.error('Failed to add a reaction:', error);
    return safeServerError();
  }
}
