import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * GET /api/customers/[id]/reviews
 * Get all reviews written by a specific customer
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: customerId } = await params;

    // Verify user is authenticated and is the customer or has permission
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow users to view their own reviews (or admins in the future)
    if (session.user.id !== customerId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Get reviews with installer details
    const reviewsResult = await sql`
      SELECT
        r.id,
        r.installer_profile_id,
        r.service_category_id,
        r.rating,
        r.title,
        r.comment,
        r.work_completed_at,
        r.is_verified,
        r.helpful_count,
        r.created_at,
        r.updated_at,
        ip.business_name as installer_business_name,
        u.name as installer_name,
        u.avatar_url as installer_avatar,
        ip.is_verified as installer_verified,
        sc.name_ro as service_name,
        COALESCE(ip.business_name, u.name) as installer_display_name
      FROM reviews r
      JOIN installer_profiles ip ON r.installer_profile_id = ip.id
      JOIN users u ON ip.user_id = u.id
      LEFT JOIN service_categories sc ON r.service_category_id = sc.id
      WHERE r.customer_id = ${customerId}
      ORDER BY r.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM reviews
      WHERE customer_id = ${customerId}
    `;

    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: reviewsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
      },
      { status: 500 }
    );
  }
}
