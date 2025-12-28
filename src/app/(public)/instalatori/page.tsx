import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { InstallerCard } from '@/components/installer/InstallerCard';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/search/SortSelect';
import { auth } from '@/lib/auth';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    service_id?: string;
    city_id?: string;
    region_id?: string;
    rating_min?: string;
    available?: string;
    page?: string;
    sort?: string;
  }>;
}

async function getInstallers(searchParams: Awaited<PageProps['searchParams']>) {
  try {
    const params = new URLSearchParams();

    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.service_id) params.set('service_id', searchParams.service_id);
    if (searchParams.city_id) params.set('city_id', searchParams.city_id);
    if (searchParams.region_id) params.set('region_id', searchParams.region_id);
    if (searchParams.rating_min) params.set('rating_min', searchParams.rating_min);
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

export default async function InstallersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data: installers, pagination } = await getInstallers(params);
  const hasFilters =
    params.search ||
    params.service_id ||
    params.city_id ||
    params.region_id ||
    params.rating_min ||
    params.available;

  // Track search history for authenticated customers
  const session = await auth();
  if (session?.user?.role === 'customer' && (params.search || params.service_id || params.city_id)) {
    // Fire-and-forget POST (don't await, don't block render)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/customers/${session.user.id}/search-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search_query: params.search || null,
        service_category_id: params.service_id ? parseInt(params.service_id) : null,
        city_id: params.city_id ? parseInt(params.city_id) : null,
        region_id: params.region_id ? parseInt(params.region_id) : null,
        results_count: pagination.total,
      }),
    }).catch(() => {}); // Silent fail - don't block page render
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Găsește instalatori de încredere
          </h1>
          <p className="text-gray-600">
            Căutați printre profesioniști verificați din întreaga țară
          </p>
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
                    ? 'Încercați să modificați criteriile de căutare sau să eliminați filtrele.'
                    : 'Nu există instalatori în baza de date momentan.'}
                </p>
                {hasFilters && (
                  <a
                    href="/instalatori"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Elimină toate filtrele
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
