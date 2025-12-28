import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ViewSource } from '@/lib/db/schema';

/**
 * POST /api/installers/[id]/views
 * Track a profile view for an installer
 * Supports both authenticated and anonymous views
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: installerId } = await params;

    // Authentication is optional (can be anonymous)
    const session = await auth();
    const viewerId = session?.user?.id || null;

    // Get request body
    const body = await request.json();
    const { view_source = 'direct' } = body as { view_source?: ViewSource };

    // Validate view_source
    const validSources: ViewSource[] = ['direct', 'search', 'category', 'referral'];
    if (!validSources.includes(view_source)) {
      return NextResponse.json(
        { success: false, error: 'Invalid view_source. Must be one of: direct, search, category, referral' },
        { status: 400 }
      );
    }

    // Verify installer exists
    const installerResult = await sql`
      SELECT id FROM installer_profiles
      WHERE id = ${installerId}
    `;

    if (installerResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer not found' },
        { status: 404 }
      );
    }

    // Insert view record
    const result = await sql`
      INSERT INTO installer_profile_views (installer_profile_id, viewer_id, view_source)
      VALUES (${installerId}, ${viewerId}, ${view_source})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Profile view tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking profile view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track profile view',
      },
      { status: 500 }
    );
  }
}
