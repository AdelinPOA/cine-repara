import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/**
 * GET /api/installers/[id]/reviews
 * Get reviews for an installer with pagination and sorting
 *
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Results per page (default: 10, max: 50)
 *   - sort: Sort by (newest, highest, lowest, helpful)
 *   - rating: Filter by rating (1-5)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: installerId } = await params;
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;

    // Filters
    const sort = searchParams.get('sort') || 'newest';
    const ratingFilter = searchParams.get('rating');

    // Build WHERE conditions
    const conditions: string[] = [`r.installer_profile_id = $1`];
    const queryParams: any[] = [installerId];
    let paramIndex = 2;

    if (ratingFilter) {
      conditions.push(`r.rating = $${paramIndex}`);
      queryParams.push(parseInt(ratingFilter));
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Build ORDER BY clause
    let orderBy = 'ORDER BY ';
    switch (sort) {
      case 'highest':
        orderBy += 'r.rating DESC, r.created_at DESC';
        break;
      case 'lowest':
        orderBy += 'r.rating ASC, r.created_at DESC';
        break;
      case 'helpful':
        orderBy += 'r.helpful_count DESC, r.created_at DESC';
        break;
      case 'newest':
      default:
        orderBy += 'r.created_at DESC';
        break;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      WHERE ${whereClause}
    `;

    const countResult = await sql.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].total);

    // Get reviews
    const reviewsQuery = `
      SELECT
        r.id,
        r.rating,
        r.title,
        r.comment,
        r.work_completed_at,
        r.is_verified,
        r.helpful_count,
        r.created_at,
        r.updated_at,
        u.name as customer_name,
        u.avatar_url as customer_avatar,
        sc.name_ro as service_name,
        sc.slug as service_slug,
        (
          SELECT json_agg(
            json_build_object(
              'id', ri.id,
              'image_url', ri.image_url,
              'caption', ri.caption,
              'display_order', ri.display_order
            )
            ORDER BY ri.display_order ASC
          )
          FROM review_images ri
          WHERE ri.review_id = r.id
        ) as images
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      JOIN service_categories sc ON r.service_category_id = sc.id
      WHERE ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const reviewsResult = await sql.query(reviewsQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    // Get rating distribution
    const distributionQuery = `
      SELECT
        rating,
        COUNT(*) as count
      FROM reviews
      WHERE installer_profile_id = $1
      GROUP BY rating
      ORDER BY rating DESC
    `;

    const distributionResult = await sql.query(distributionQuery, [installerId]);

    // Build distribution object
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    distributionResult.rows.forEach((row: any) => {
      distribution[row.rating] = parseInt(row.count);
    });

    // Get average rating
    const avgQuery = `
      SELECT
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews
      WHERE installer_profile_id = $1
    `;

    const avgResult = await sql.query(avgQuery, [installerId]);
    const stats = avgResult.rows[0];

    return NextResponse.json({
      success: true,
      data: reviewsResult.rows,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        average_rating: parseFloat(stats.average_rating),
        total_reviews: parseInt(stats.total_reviews),
        distribution,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la încărcarea recenziilor' },
      { status: 500 }
    );
  }
}
