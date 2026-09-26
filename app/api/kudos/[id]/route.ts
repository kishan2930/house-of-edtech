import { NextResponse } from 'next/server';

import { notFoundError, safeServerError, unauthorized } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { getKudos } from '@/lib/kudos/list';
import { isObjectId } from '@/lib/validators/kudos';

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
    const kudos = await getKudos(id);

    if (!kudos) {
      return notFoundError();
    }

    return NextResponse.json({ kudos });
  } catch (error) {
    console.error('Failed to load Kudos:', error);
    return safeServerError();
  }
}
