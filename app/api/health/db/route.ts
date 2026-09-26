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
    console.error('Database health check failed:', error);

    return NextResponse.json(
      {
        connected: false,
        error: 'Database connection failed.',
      },
      { status: 500 },
    );
  }
}
