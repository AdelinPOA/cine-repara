import { NextResponse } from 'next/server';
import { getInstallers } from '@/lib/queries/getInstallers';

/**
 * GET /api/installers
 * Search and filter installers
 *
 * Query params:
 *   - search: Search in business name, name, bio
 *   - service_id: Filter by service category ID
 *   - city_id: Filter by city ID
 *   - region_id: Filter by region ID
 *   - rating_min: Minimum average rating (1-5)
 *   - available: Filter by availability (true/false)
 *   - page: Page number (default: 1)
 *   - limit: Results per page (default: 12, max: 50)
 *   - sort: Sort by (rating, reviews)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert URLSearchParams to plain object
    const params = {
      search: searchParams.get('search') || undefined,
      service_id: searchParams.get('service_id') || undefined,
      city_id: searchParams.get('city_id') || undefined,
      region_id: searchParams.get('region_id') || undefined,
      rating_min: searchParams.get('rating_min') || undefined,
      available: searchParams.get('available') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      sort: searchParams.get('sort') || undefined,
    };

    const result = await getInstallers(params);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching installers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch installers' },
      { status: 500 }
    );
  }
}
