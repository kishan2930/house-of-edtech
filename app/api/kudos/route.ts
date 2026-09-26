import { NextResponse } from 'next/server';

import {
  notFoundError,
  safeServerError,
  unauthorized,
  validationError,
} from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db';
import { listKudos } from '@/lib/kudos/list';
import { serializeKudos } from '@/lib/kudos/serialize';
import { kudosViews, type KudosView } from '@/lib/kudos/types';
import { parseCreateKudos } from '@/lib/validators/kudos';
import { Kudos } from '@/models/Kudos';
import { User } from '@/models/User';

function isKudosView(value: string): value is KudosView {
  return kudosViews.some((view) => view === value);
}

export async function GET(request: Request) {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    return unauthorized();
  }

  const view = new URL(request.url).searchParams.get('view') ?? 'wall';

  if (!isKudosView(view)) {
    return NextResponse.json(
      { error: 'Check the highlighted fields.' },
      { status: 400 },
    );
  }

  try {
    const result = await listKudos(sessionUser.id, view);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to list Kudos:', error);
    return safeServerError();
  }
}

export async function POST(request: Request) {
  const sessionUser = await requireUser();

  if (!sessionUser) {
    return unauthorized();
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

  const parsed = parseCreateKudos(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (parsed.data.recipientId === sessionUser.id) {
    return NextResponse.json(
      {
        error: 'Check the highlighted fields.',
        fieldErrors: { recipientId: 'Choose someone else.' },
      },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const recipient = await User.findById(parsed.data.recipientId).select(
      'name',
    );

    if (!recipient) {
      return notFoundError();
    }

    const doc = await Kudos.create({
      senderId: sessionUser.id,
      recipientId: parsed.data.recipientId,
      message: parsed.data.message,
      template: parsed.data.template,
    });

    const kudos = serializeKudos(
      doc,
      new Map([
        [sessionUser.id, sessionUser.name],
        [recipient._id.toString(), recipient.name],
      ]),
    );

    return NextResponse.json({ kudos }, { status: 201 });
  } catch (error) {
    console.error('Failed to create Kudos:', error);
    return safeServerError();
  }
}
