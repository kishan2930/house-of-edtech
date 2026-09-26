import { NextResponse } from 'next/server';

import { unauthorized } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/session';
import { listKudos } from '@/lib/kudos/list';
import { kudosViews, type KudosView } from '@/lib/kudos/types';

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

  const result = await listKudos();

  return NextResponse.json(result);
}
