import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { InstallerCard } from '@/components/installer/InstallerCard';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/search/SortSelect';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    city_id?: string;
    region_id?: string;
    rating_min?: string;
    price_max?: string;
    available?: string;
    page?: string;
    sort?: string;
  }>;
}

async function getServiceCategory(slug: string) {
  try {
    const result = await sql`
      SELECT id, name_ro, name_en, slug, description
      FROM service_categories
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching service category:', error);
    return null;
  }
}

async function getInstallersByService(
  serviceId: number,
  searchParams: Awaited<PageProps['searchParams']>
) {
  try {
    const params = new URLSearchParams();
    params.set('service_id', String(serviceId));

    if (searchParams.city_id) params.set('city_id', searchParams.city_id);
    if (searchParams.region_id) params.set('region_id', searchParams.region_id);
    if (searchParams.rating_min) params.set('rating_min', searchParams.rating_min);
    if (searchParams.price_max) params.set('price_max', searchParams.price_max);
    if (searchParams.available) params.set('available', searchParams.available);
    if (searchParams.page) params.set('page', searchParams.page);
    if (searchParams.sort) params.set('sort', searchParams.sort);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/installers?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching installers:', error);
    return { data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export default async function ServiceCategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const searchParamsData = await searchParams;

  const service = await getServiceCategory(slug);

  if (!service) {
    notFound();
  }

  const { data: installers, pagination } = await getInstallersByService(
    service.id,
    searchParamsData
  );

  const hasFilters =
    searchParamsData.city_id ||
    searchParamsData.region_id ||
    searchParamsData.rating_min ||
    searchParamsData.price_max ||
    searchParamsData.available;

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
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-600">
              Acasă
            </a>
            {' / '}
            <a href="/instalatori" className="hover:text-blue-600">
              Instalatori
            </a>
            {' / '}
            <span className="text-gray-900">{service.name_ro}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name_ro}</h1>
          {service.description && (
            <p className="text-gray-600">{service.description}</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <FilterPanel />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort and Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {pagination.total > 0
                  ? `${pagination.total} ${
                      pagination.total === 1 ? 'instalator găsit' : 'instalatori găsiți'
                    }`
                  : 'Niciun instalator găsit'}
              </p>
              {pagination.total > 0 && <SortSelect />}
            </div>

            {/* Results Grid */}
            {installers.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                  {installers.map((installer: any) => (
                    <InstallerCard key={installer.id} installer={installer} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.total}
                />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Niciun instalator găsit
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasFilters
                    ? `Nu există instalatori pentru ${service.name_ro} cu aceste criterii de căutare.`
                    : `Nu există instalatori pentru ${service.name_ro} momentan.`}
                </p>
                {hasFilters && (
                  <a
                    href={`/servicii/${slug}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Elimină filtrele
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
