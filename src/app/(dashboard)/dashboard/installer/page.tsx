import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { InstallerDashboardStats } from '@/components/installer/InstallerDashboardStats';
import { InstallerProfilePreview } from '@/components/installer/InstallerProfilePreview';
import { InstallerReviewsSection } from '@/components/installer/InstallerReviewsSection';
import type {
  InstallerWithDetails,
  ServiceCategory,
  City,
  InstallerCertification,
  PortfolioImage,
} from '@/lib/db/schema';

export default async function InstallerDashboardPage() {
  const session = await auth();

  if (session?.user.role !== 'installer') {
    redirect('/dashboard/customer');
  }

  // Fetch installer profile
  const installerResult = await sql<InstallerWithDetails>`
    SELECT * FROM installer_summary
    WHERE user_id = ${session.user.id}
  `;

  if (installerResult.rowCount === 0) {
    // No profile exists, redirect to create one
    redirect('/dashboard/installer/profile');
  }

  const installer = installerResult.rows[0];

  // Check if profile is completed
  if (!installer.profile_completed) {
    redirect('/dashboard/installer/profile');
  }

  // Fetch full installer details (services, areas, etc.)
  const [servicesResult, citiesResult, certificationsResult, portfolioResult] = await Promise.all([
    sql<ServiceCategory>`
      SELECT
        sc.id,
        sc.name_ro,
        sc.name_en,
        sc.slug,
        sc.icon,
        ins.is_primary
      FROM installer_services ins
      JOIN service_categories sc ON ins.service_category_id = sc.id
      WHERE ins.installer_profile_id = ${installer.id}
      ORDER BY ins.is_primary DESC, sc.name_ro ASC
    `,
    sql<City>`
      SELECT
        c.id,
        c.name,
        c.region_id,
        c.postal_code,
        r.name as region_name
      FROM installer_service_areas isa
      JOIN cities c ON isa.city_id = c.id
      JOIN regions r ON c.region_id = r.id
      WHERE isa.installer_profile_id = ${installer.id}
      ORDER BY c.name ASC
    `,
    sql<InstallerCertification>`
      SELECT *
      FROM installer_certifications
      WHERE installer_profile_id = ${installer.id}
      ORDER BY issue_date DESC NULLS LAST
    `,
    sql<PortfolioImage>`
      SELECT *
      FROM portfolio_images
      WHERE installer_profile_id = ${installer.id}
      ORDER BY display_order ASC, created_at DESC
    `,
  ]);

  // Count total profile views
  const viewsResult = await sql`
    SELECT COUNT(*) as total
    FROM installer_profile_views
    WHERE installer_profile_id = ${installer.id}
  `;

  const profileViews = parseInt(viewsResult.rows[0]?.total || '0', 10);

  const installerWithDetails: InstallerWithDetails = {
    ...installer,
    services: servicesResult.rows,
    service_areas: citiesResult.rows,
    certifications: certificationsResult.rows,
    portfolio: portfolioResult.rows,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Instalator
        </h1>
        <p className="text-gray-600 mt-2">
          Bine ați revenit, {installer.name}!
        </p>
      </div>

      {/* Statistics Cards */}
      <InstallerDashboardStats installer={installer} profileViews={profileViews} />

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Preview */}
        <InstallerProfilePreview installer={installerWithDetails} />

        {/* Recent Reviews */}
        <InstallerReviewsSection installerId={installer.id} limit={5} />
      </div>
    </div>
  );
}
