import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search');
    const serviceId = searchParams.get('service_id');
    const cityId = searchParams.get('city_id');
    const regionId = searchParams.get('region_id');
    const ratingMin = searchParams.get('rating_min');
    const available = searchParams.get('available');
    const sort = searchParams.get('sort') || 'rating';

    // Build WHERE conditions
    const conditions: string[] = ['ip.profile_completed = true'];
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(
        ip.business_name ILIKE $${paramIndex} OR
        u.name ILIKE $${paramIndex} OR
        ip.bio ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (serviceId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_services ins
        WHERE ins.installer_profile_id = ip.id
        AND ins.service_category_id = $${paramIndex}
      )`);
      params.push(parseInt(serviceId));
      paramIndex++;
    }

    if (cityId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_service_areas isa
        WHERE isa.installer_profile_id = ip.id
        AND isa.city_id = $${paramIndex}
      )`);
      params.push(parseInt(cityId));
      paramIndex++;
    }

    if (regionId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_service_areas isa
        JOIN cities c ON isa.city_id = c.id
        WHERE isa.installer_profile_id = ip.id
        AND c.region_id = $${paramIndex}
      )`);
      params.push(parseInt(regionId));
      paramIndex++;
    }

    if (ratingMin) {
      conditions.push(`(
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE installer_profile_id = ip.id
      ) >= $${paramIndex}`);
      params.push(parseFloat(ratingMin));
      paramIndex++;
    }

    if (available === 'true') {
      conditions.push('ip.is_available = true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'ORDER BY ';
    switch (sort) {
      case 'reviews':
        orderBy += '(SELECT COUNT(*) FROM reviews WHERE installer_profile_id = ip.id) DESC';
        break;
      case 'rating':
      default:
        orderBy += '(SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE installer_profile_id = ip.id) DESC, ip.is_verified DESC';
        break;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM installer_profiles ip
      JOIN users u ON ip.user_id = u.id
      ${whereClause}
    `;

    const countResult = await sql.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].total);

    // Get installers
    const installersQuery = `
      SELECT
        ip.*,
        u.name,
        u.email,
        u.phone,
        u.avatar_url,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE installer_profile_id = ip.id) as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE installer_profile_id = ip.id) as review_count
      FROM installer_profiles ip
      JOIN users u ON ip.user_id = u.id
      ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const installersResult = await sql.query(installersQuery, [...params, limit, offset]);

    // For each installer, get services and cities
    const installers = await Promise.all(
      installersResult.rows.map(async (installer) => {
        // Get services
        const servicesResult = await sql`
          SELECT
            sc.id,
            sc.name_ro,
            sc.slug,
            ins.is_primary
          FROM installer_services ins
          JOIN service_categories sc ON ins.service_category_id = sc.id
          WHERE ins.installer_profile_id = ${installer.id}
          ORDER BY ins.is_primary DESC, sc.name_ro ASC
        `;

        // Get cities
        const citiesResult = await sql`
          SELECT
            c.id,
            c.name,
            r.name as region_name
          FROM installer_service_areas isa
          JOIN cities c ON isa.city_id = c.id
          JOIN regions r ON c.region_id = r.id
          WHERE isa.installer_profile_id = ${installer.id}
          ORDER BY c.name ASC
        `;

        return {
          ...installer,
          services: servicesResult.rows,
          cities: citiesResult.rows,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: installers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching installers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch installers' },
      { status: 500 }
    );
  }
}
