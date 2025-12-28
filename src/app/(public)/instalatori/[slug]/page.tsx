import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { sql } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ReviewList } from '@/components/review/ReviewList';
import { ReviewForm } from '@/components/review/ReviewForm';
import { ProfileViewTracker } from '@/components/installer/ProfileViewTracker';
import { auth } from '@/lib/auth';
import type { InstallerWithDetails, ServiceCategory, City } from '@/lib/db/schema';
import { formatCount, formatPriceRange, formatHourlyRate } from '@/lib/utils/format';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const installer = await getInstallerBySlug(slug);

  if (!installer) {
    return {
      title: 'Instalator negăsit',
    };
  }

  const name = installer.business_name || installer.name;
  const services = installer.services?.map((s: any) => s.name_ro).join(', ') || '';
  const city = installer.service_areas?.[0]?.name || 'România';

  return {
    title: `${name} - Instalator ${city}`,
    description: installer.bio || `${name} oferă servicii de ${services} în ${city}. Rating: ${installer.average_rating.toFixed(1)} (${installer.review_count} recenzii).`,
    keywords: [name, ...services.split(', '), city, 'instalator', 'servicii'],
    openGraph: {
      title: `${name} - Instalator ${city}`,
      description: installer.bio?.slice(0, 160) || `Servicii de calitate în ${city}`,
      type: 'profile',
    },
  };
}

async function getInstallerBySlug(slug: string): Promise<InstallerWithDetails | null> {
  try {
    // Extract ID from slug (last segment after final hyphen)
    const parts = slug.split('-');
    const shortId = parts[parts.length - 1];

    // Find installer by matching the beginning of the ID
    const installerResult = await sql<InstallerWithDetails>`
      SELECT * FROM installer_summary
      WHERE id::text LIKE ${shortId + '%'}
      AND profile_completed = true
      LIMIT 1
    `;

    if (installerResult.rowCount === 0) {
      return null;
    }

    const installer = installerResult.rows[0];
    const installerId = installer.id;

    // Get services
    const servicesResult = await sql`
      SELECT
        sc.id,
        sc.name_ro,
        sc.slug,
        sc.icon,
        ins.is_primary
      FROM installer_services ins
      JOIN service_categories sc ON ins.service_category_id = sc.id
      WHERE ins.installer_profile_id = ${installerId}
      ORDER BY ins.is_primary DESC, sc.name_ro ASC
    `;

    // Get service areas
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

    return {
      ...installer,
      services: servicesResult.rows as ServiceCategory[],
      service_areas: citiesResult.rows as City[],
      certifications: [],
      portfolio: [],
    };
  } catch (error) {
    console.error('Error fetching installer:', error);
    return null;
  }
}

export default async function InstallerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const installer = await getInstallerBySlug(slug);
  const session = await auth();

  if (!installer) {
    notFound();
  }

  // Check if current user can leave a review
  const canReview =
    session?.user &&
    session.user.role === 'customer' &&
    session.user.id !== installer.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Track profile view */}
      <ProfileViewTracker installerId={installer.id} viewSource="direct" />

      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Cine Repara
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {installer.business_name || installer.name}
                    </h1>
                    {installer.is_verified && (
                      <Badge variant="success">Verificat</Badge>
                    )}
                    {!installer.is_available && (
                      <Badge variant="warning">Indisponibil</Badge>
                    )}
                  </div>
                  {installer.business_name && (
                    <p className="text-lg text-gray-600">{installer.name}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              {installer.review_count > 0 && (
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(installer.average_rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-3 text-lg font-medium text-gray-900">
                    {installer.average_rating.toFixed(1)}
                  </span>
                  <span className="ml-2 text-gray-600">
                    ({formatCount(installer.review_count, 'recenzie', 'recenzii')})
                  </span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {installer.years_experience && (
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{installer.years_experience} ani de experiență</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{installer.service_count} servicii oferite</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{installer.service_area_count} orașe acoperite</span>
                </div>
              </div>

              {/* Bio */}
              {installer.bio && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{installer.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                {installer.phone && (
                  <a
                    href={`tel:${installer.phone}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Sună acum
                  </a>
                )}
                {installer.email && (
                  <a
                    href={`mailto:${installer.email}`}
                    className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Trimite email
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Servicii oferite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {installer.services.map((service) => (
                      <Badge
                        key={service.id}
                        variant={service.is_primary ? 'primary' : 'default'}
                        className="text-sm px-3 py-1"
                      >
                        {service.name_ro}
                        {service.is_primary && ' ⭐'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Form - Only for logged-in customers */}
              {canReview && (
                <ReviewForm
                  installerId={installer.id}
                  installerName={installer.business_name || installer.name}
                />
              )}

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Recenzii</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewList installerId={installer.id} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing */}
              {(installer.hourly_rate_min || installer.hourly_rate_max) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tarif orar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {installer.hourly_rate_min && installer.hourly_rate_max
                        ? formatPriceRange(installer.hourly_rate_min, installer.hourly_rate_max)
                        : installer.hourly_rate_min
                        ? `de la ${installer.hourly_rate_min} RON`
                        : `până la ${installer.hourly_rate_max} RON`}{' '}
                      <span className="text-lg font-normal text-gray-600">/oră</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Tariful poate varia în funcție de complexitatea lucrării
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Service Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Zone de acoperire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {installer.service_areas.map((city) => (
                      <div
                        key={city.id}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        <span>
                          {city.name}
                          {city.region_name && (
                            <span className="text-gray-500 ml-1">
                              ({city.region_name})
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
