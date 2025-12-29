import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import { addFavoriteSchema } from '@/lib/validations/favorites';
import type { CustomerFavoriteWithInstaller } from '@/lib/db/schema';

/**
 * GET /api/customers/[id]/favorites
 * Get all favorite installers for a specific customer
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

    // Only allow users to view their own favorites
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

    // Get favorites with installer details
    const favoritesResult = await sql<CustomerFavoriteWithInstaller>`
      SELECT
        cf.id,
        cf.customer_id,
        cf.installer_profile_id,
        cf.created_at,
        COALESCE(ip.business_name, u.name) as installer_name,
        ip.business_name as installer_business_name,
        u.avatar_url as installer_avatar,
        ip.is_verified as installer_verified,
        COALESCE(AVG(r.rating), 0) as installer_rating,
        COUNT(DISTINCT r.id) as installer_review_count,
        (
          SELECT sc.name_ro
          FROM installer_services iis
          JOIN service_categories sc ON iis.service_category_id = sc.id
          WHERE iis.installer_profile_id = ip.id AND iis.is_primary = true
          LIMIT 1
        ) as primary_service,
        (
          SELECT COUNT(*)
          FROM installer_service_areas isa
          WHERE isa.installer_profile_id = ip.id
        ) as service_area_count
      FROM customer_favorites cf
      JOIN installer_profiles ip ON cf.installer_profile_id = ip.id
      JOIN users u ON ip.user_id = u.id
      LEFT JOIN reviews r ON ip.id = r.installer_profile_id
      WHERE cf.customer_id = ${customerId}
      GROUP BY cf.id, ip.id, ip.business_name, u.name, u.avatar_url, ip.is_verified
      ORDER BY cf.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM customer_favorites
      WHERE customer_id = ${customerId}
    `;

    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: favoritesResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching customer favorites:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch favorites',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers/[id]/favorites
 * Add an installer to customer's favorites
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

    // Only allow users to add to their own favorites
    if (session.user.id !== customerId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = addFavoriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { installer_profile_id } = validation.data;

    // Verify installer exists and profile is completed
    const installerResult = await sql`
      SELECT id, profile_completed
      FROM installer_profiles
      WHERE id = ${installer_profile_id}
    `;

    if (installerResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];
    if (!installer.profile_completed) {
      return NextResponse.json(
        { success: false, error: 'Installer profile is not completed' },
        { status: 400 }
      );
    }

    // Insert favorite (UNIQUE constraint will prevent duplicates)
    const result = await sql`
      INSERT INTO customer_favorites (customer_id, installer_profile_id)
      VALUES (${customerId}, ${installer_profile_id})
      ON CONFLICT (customer_id, installer_profile_id) DO NOTHING
      RETURNING *
    `;

    // Check if insert was successful or already existed
    if (result.rowCount === 0) {
      // Favorite already exists, fetch it
      const existingResult = await sql`
        SELECT * FROM customer_favorites
        WHERE customer_id = ${customerId} AND installer_profile_id = ${installer_profile_id}
      `;

      return NextResponse.json({
        success: true,
        data: existingResult.rows[0],
        message: 'Installer was already in favorites',
      });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Installer added to favorites',
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add favorite',
      },
      { status: 500 }
    );
  }
}
