import { NextResponse } from 'next/server';

/**
 * Simple health-check Route Handler.
 * Route Handlers live under app/api/ — they are your backend endpoints in Next.js.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
