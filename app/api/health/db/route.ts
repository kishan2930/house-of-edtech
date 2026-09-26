import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import { Placeholder } from '@/models/Placeholder';

/**
 * Database health check — confirms Atlas connection and model access.
 * GET /api/health/db → { connected: true, count: 0 }
 */
export async function GET() {
  try {
    await connectDB();
    const count = await Placeholder.countDocuments();

    return NextResponse.json({
      connected: true,
      count,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';

    return NextResponse.json(
      {
        connected: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
