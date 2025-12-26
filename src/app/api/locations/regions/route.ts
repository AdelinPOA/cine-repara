import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Region } from '@/lib/db/schema';

/**
 * GET /api/locations/regions
 * Returns all Romanian regions (județe)
 */
export async function GET() {
  try {
    const result = await sql<Region>`
      SELECT
        id,
        name,
        code,
        type
      FROM regions
      ORDER BY name ASC
    `;

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}
