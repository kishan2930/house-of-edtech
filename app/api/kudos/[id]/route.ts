import { NextResponse } from 'next/server';

import {
  notFoundError,
  safeServerError,
  unauthorized,
  validationError,
} from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { canEditKudos } from '@/lib/kudos/edit-window';
import { getKudos } from '@/lib/kudos/list';
import { isObjectId, parseUpdateKudos } from '@/lib/validators/kudos';
import { Kudos } from '@/models/Kudos';
import { Reaction } from '@/models/Reaction';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function forbidden(error: string) {
  return NextResponse.json({ error }, { status: 403 });
}

async function ownedKudos(id: string, userId: string) {
  await connectDB();

  const doc = await Kudos.findById(id);

  if (!doc) {
    return { error: notFoundError() };
  }

  if (doc.senderId.toString() !== userId) {
    return { error: forbidden('You can only change Kudos you sent.') };
  }

  return { doc };
}

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
    const kudos = await getKudos(id, sessionUser.id);

    if (!kudos) {
      return notFoundError();
    }

    return NextResponse.json({ kudos });
  } catch (error) {
    console.error('Failed to load Kudos:', error);
    return safeServerError();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const parsed = parseUpdateKudos(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const owned = await ownedKudos(id, sessionUser.id);

    if ('error' in owned) {
      return owned.error;
    }

    if (!canEditKudos(owned.doc.createdAt)) {
      return forbidden(
        'You can edit a message for 30 minutes after you send it.',
      );
    }

    owned.doc.message = parsed.data.message;
    await owned.doc.save();

    const kudos = await getKudos(id, sessionUser.id);

    if (!kudos) {
      return notFoundError();
    }

    return NextResponse.json({ kudos });
  } catch (error) {
    console.error('Failed to update Kudos:', error);
    return safeServerError();
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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
    const owned = await ownedKudos(id, sessionUser.id);

    if ('error' in owned) {
      return owned.error;
    }

    await Promise.all([
      Kudos.deleteOne({ _id: owned.doc._id }),
      Reaction.deleteMany({ kudosId: owned.doc._id }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete Kudos:', error);
    return safeServerError();
  }
}
