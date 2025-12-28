import { sql } from '@/lib/db';

export interface GetInstallersParams {
  search?: string;
  service_id?: string;
  city_id?: string;
  region_id?: string;
  rating_min?: string;
  available?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export interface InstallerResult {
  id: string;
  user_id: string;
  business_name: string | null;
  bio: string | null;
  years_experience: number | null;
  is_verified: boolean;
  is_available: boolean;
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  average_rating: number;
  review_count: number;
  services: Array<{
    id: number;
    name_ro: string;
    slug: string;
    is_primary: boolean;
  }>;
  cities: Array<{
    id: number;
    name: string;
    region_name: string;
  }>;
}

export interface GetInstallersResult {
  data: InstallerResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get installers with filtering, sorting, and pagination
 * Used by both API route and Server Components
 */
export async function getInstallers(
  params: GetInstallersParams
): Promise<GetInstallersResult> {
  try {
    // Pagination
    const page = parseInt(params.page || '1');
    const limit = Math.min(parseInt(params.limit || '12'), 50);
    const offset = (page - 1) * limit;

    // Filters
    const search = params.search;
    const serviceId = params.service_id;
    const cityId = params.city_id;
    const regionId = params.region_id;
    const ratingMin = params.rating_min;
    const available = params.available;
    const sort = params.sort || 'rating';

    // Build WHERE conditions
    const conditions: string[] = ['ip.profile_completed = true'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(
        ip.business_name ILIKE $${paramIndex} OR
        u.name ILIKE $${paramIndex} OR
        ip.bio ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (serviceId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_services ins
        WHERE ins.installer_profile_id = ip.id
        AND ins.service_category_id = $${paramIndex}
      )`);
      queryParams.push(parseInt(serviceId));
      paramIndex++;
    }

    if (cityId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_service_areas isa
        WHERE isa.installer_profile_id = ip.id
        AND isa.city_id = $${paramIndex}
      )`);
      queryParams.push(parseInt(cityId));
      paramIndex++;
    }

    if (regionId) {
      conditions.push(`EXISTS (
        SELECT 1 FROM installer_service_areas isa
        JOIN cities c ON isa.city_id = c.id
        WHERE isa.installer_profile_id = ip.id
        AND c.region_id = $${paramIndex}
      )`);
      queryParams.push(parseInt(regionId));
      paramIndex++;
    }

    if (ratingMin) {
      conditions.push(`(
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE installer_profile_id = ip.id
      ) >= $${paramIndex}`);
      queryParams.push(parseFloat(ratingMin));
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

    const countResult = await sql.query(countQuery, queryParams);
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

    const installersResult = await sql.query(installersQuery, [...queryParams, limit, offset]);

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

    return {
      data: installers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error('Error in getInstallers:', error);
    return {
      data: [],
      pagination: {
        page: parseInt(params.page || '1'),
        limit: parseInt(params.limit || '12'),
        total: 0,
        totalPages: 0,
      },
    };
  }
}
