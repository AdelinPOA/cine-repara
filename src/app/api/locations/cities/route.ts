import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { CityWithRegion } from '@/lib/db/schema';

/**
 * GET /api/locations/cities
 * Returns all Romanian cities, optionally filtered by region
 * Query params:
 *   - region_id: Filter by region ID
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');

    let query;
    if (regionId) {
      query = sql<CityWithRegion>`
        SELECT
          c.id,
          c.name,
          c.region_id,
          c.postal_code,
          c.latitude,
          c.longitude,
          c.population,
          r.name as region_name,
          r.code as region_code
        FROM cities c
        JOIN regions r ON c.region_id = r.id
        WHERE c.region_id = ${parseInt(regionId)}
        ORDER BY c.population DESC NULLS LAST, c.name ASC
      `;
    } else {
      query = sql<CityWithRegion>`
        SELECT
          c.id,
          c.name,
          c.region_id,
          c.postal_code,
          c.latitude,
          c.longitude,
          c.population,
          r.name as region_name,
          r.code as region_code
        FROM cities c
        JOIN regions r ON c.region_id = r.id
        ORDER BY c.population DESC NULLS LAST, c.name ASC
      `;
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
