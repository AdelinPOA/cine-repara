import Link from 'next/link';
import { sql } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/Card';

async function getServiceCategories() {
  try {
    const result = await sql`
      SELECT
        sc.id,
        sc.name_ro,
        sc.name_en,
        sc.slug,
        sc.icon,
        sc.description,
        COUNT(DISTINCT ins.installer_profile_id) as installer_count
      FROM service_categories sc
      LEFT JOIN installer_services ins ON sc.id = ins.service_category_id
      WHERE sc.parent_id IS NULL
      GROUP BY sc.id, sc.name_ro, sc.name_en, sc.slug, sc.icon, sc.description, sc.display_order
      ORDER BY sc.display_order ASC, sc.name_ro ASC
    `;

    return result.rows;
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServiceCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Cine Repara
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-600">
              Acasă
            </a>
            {' / '}
            <span className="text-gray-900">Servicii</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explorează servicii
          </h1>
          <p className="text-gray-600">
            Găsește instalatori specializați pentru nevoile tale
          </p>
        </div>

        {/* Service Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service: any) => (
            <Link key={service.id} href={`/servicii/${service.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    {service.icon && (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {service.icon === 'wrench' && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                          )}
                          {service.icon === 'bolt' && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          )}
                          {service.icon === 'fire' && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                          )}
                          {/* Default icon if none match */}
                          {!['wrench', 'bolt', 'fire'].includes(service.icon) && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          )}
                        </svg>
                      </div>
                    )}

                    {/* Service Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.name_ro}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Installer Count */}
                    <p className="text-sm text-blue-600 font-medium">
                      {service.installer_count}{' '}
                      {service.installer_count === 1 ? 'instalator' : 'instalatori'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Services */}
        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">Nu există servicii disponibile momentan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
