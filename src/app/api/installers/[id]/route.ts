import { NextResponse } from 'next/server';
import { sql, transaction } from '@/lib/db';
import { auth } from '@/lib/auth';
import { installerProfileSchema, completeProfileSchema } from '@/lib/validations/installer';
import type { InstallerWithDetails, ServiceCategory, City, InstallerCertification, PortfolioImage } from '@/lib/db/schema';

/**
 * GET /api/installers/[id]
 * Get installer profile with full details
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: installerId } = await params;

    // Get installer summary
    const installerResult = await sql<InstallerWithDetails>`
      SELECT * FROM installer_summary
      WHERE id = ${installerId}
    `;

    if (installerResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer not found' },
        { status: 404 }
      );
    }

    const installer = installerResult.rows[0];

    // Get services
    const servicesResult = await sql`
      SELECT
        sc.id,
        sc.name_ro,
        sc.name_en,
        sc.slug,
        sc.icon,
        ins.is_primary
      FROM installer_services ins
      JOIN service_categories sc ON ins.service_category_id = sc.id
      WHERE ins.installer_profile_id = ${installerId}
      ORDER BY ins.is_primary DESC, sc.name_ro ASC
    `;

    // Get service areas (cities)
    const citiesResult = await sql`
      SELECT
        c.id,
        c.name,
        c.region_id,
        r.name as region_name,
        r.code as region_code
      FROM installer_service_areas isa
      JOIN cities c ON isa.city_id = c.id
      JOIN regions r ON c.region_id = r.id
      WHERE isa.installer_profile_id = ${installerId}
      ORDER BY c.name ASC
    `;

    // Get certifications
    const certificationsResult = await sql`
      SELECT *
      FROM installer_certifications
      WHERE installer_profile_id = ${installerId}
      ORDER BY issue_date DESC NULLS LAST
    `;

    // Get portfolio
    const portfolioResult = await sql`
      SELECT *
      FROM portfolio_images
      WHERE installer_profile_id = ${installerId}
      ORDER BY display_order ASC, created_at DESC
    `;

    const installerWithDetails: InstallerWithDetails = {
      ...installer,
      services: servicesResult.rows as ServiceCategory[],
      service_areas: citiesResult.rows as City[],
      certifications: certificationsResult.rows as InstallerCertification[],
      portfolio: portfolioResult.rows as PortfolioImage[],
    };

    return NextResponse.json({
      success: true,
      data: installerWithDetails,
    });
  } catch (error) {
    console.error('Error fetching installer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch installer' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/installers/[id]
 * Update installer profile (including services and locations)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: installerId } = await params;

    // Verify ownership
    const ownerCheck = await sql`
      SELECT user_id FROM installer_profiles WHERE id = ${installerId}
    `;

    if (ownerCheck.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Installer profile not found' },
        { status: 404 }
      );
    }

    if (ownerCheck.rows[0].user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Use transaction for atomic updates
    await transaction(async () => {
      // Update profile
      const {
        business_name,
        bio,
        years_experience,
        hourly_rate_min,
        hourly_rate_max,
        is_available,
        service_category_ids,
        primary_service_id,
        city_ids,
      } = body;

      // Validate profile data
      if (business_name !== undefined || bio !== undefined || years_experience !== undefined) {
        const profileData = installerProfileSchema.parse({
          business_name,
          bio,
          years_experience,
          hourly_rate_min,
          hourly_rate_max,
          is_available,
        });

        await sql`
          UPDATE installer_profiles
          SET
            business_name = ${profileData.business_name || null},
            bio = ${profileData.bio || null},
            years_experience = ${profileData.years_experience || null},
            hourly_rate_min = ${profileData.hourly_rate_min || null},
            hourly_rate_max = ${profileData.hourly_rate_max || null},
            is_available = ${profileData.is_available},
            profile_completed = true,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${installerId}
        `;
      }

      // Update services if provided
      if (service_category_ids) {
        // Delete existing services
        await sql`
          DELETE FROM installer_services
          WHERE installer_profile_id = ${installerId}
        `;

        // Insert new services
        for (const categoryId of service_category_ids) {
          await sql`
            INSERT INTO installer_services (installer_profile_id, service_category_id, is_primary)
            VALUES (${installerId}, ${categoryId}, ${categoryId === primary_service_id})
          `;
        }
      }

      // Update service areas if provided
      if (city_ids) {
        // Delete existing service areas
        await sql`
          DELETE FROM installer_service_areas
          WHERE installer_profile_id = ${installerId}
        `;

        // Insert new service areas
        for (const cityId of city_ids) {
          await sql`
            INSERT INTO installer_service_areas (installer_profile_id, city_id)
            VALUES (${installerId}, ${cityId})
          `;
        }
      }
    });

    // Fetch updated installer
    const updatedResult = await sql`
      SELECT * FROM installer_summary
      WHERE id = ${installerId}
    `;

    return NextResponse.json({
      success: true,
      data: updatedResult.rows[0],
      message: 'Profilul a fost actualizat cu succes',
    });
  } catch (error: any) {
    console.error('Error updating installer:', error);

    if (error.errors) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update installer' },
      { status: 500 }
    );
  }
}
