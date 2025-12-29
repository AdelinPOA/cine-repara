import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import { searchHistorySchema } from '@/lib/validations/search';
import type { CustomerSearchHistoryWithDetails } from '@/lib/db/schema';

/**
 * GET /api/customers/[id]/search-history
 * Get search history for a specific customer
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: customerId } = await params;

    // Verify user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow users to view their own search history
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

    // Get search history with details
    const historyResult = await sql<CustomerSearchHistoryWithDetails>`
      SELECT
        sh.id,
        sh.customer_id,
        sh.search_query,
        sh.service_category_id,
        sh.city_id,
        sh.region_id,
        sh.results_count,
        sh.created_at,
        sc.name_ro as service_name,
        c.name as city_name,
        r.name as region_name
      FROM customer_search_history sh
      LEFT JOIN service_categories sc ON sh.service_category_id = sc.id
      LEFT JOIN cities c ON sh.city_id = c.id
      LEFT JOIN regions r ON sh.region_id = r.id
      WHERE sh.customer_id = ${customerId}
      ORDER BY sh.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM customer_search_history
      WHERE customer_id = ${customerId}
    `;

    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: historyResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch search history',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers/[id]/search-history
 * Log a new search query to customer's search history
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: customerId } = await params;

    // Verify user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow users to add to their own search history
    if (session.user.id !== customerId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = searchHistorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search history data',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      search_query,
      service_category_id,
      city_id,
      region_id,
      results_count,
    } = validation.data;

    // Insert search history
    const result = await sql`
      INSERT INTO customer_search_history (
        customer_id,
        search_query,
        service_category_id,
        city_id,
        region_id,
        results_count
      )
      VALUES (
        ${customerId},
        ${search_query},
        ${service_category_id},
        ${city_id},
        ${region_id},
        ${results_count}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Search logged successfully',
    });
  } catch (error) {
    console.error('Error logging search history:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to log search',
      },
      { status: 500 }
    );
  }
}
