'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatNumber } from '@/lib/utils/format';

interface SearchHistoryItem {
  id: number;
  customer_id: string;
  search_query: string | null;
  service_category_id: number | null;
  city_id: number | null;
  region_id: number | null;
  results_count: number;
  created_at: string;
  service_name: string | null;
  city_name: string | null;
  region_name: string | null;
}

interface SearchHistoryListProps {
  customerId: string;
  limit?: number;
}

export function SearchHistoryList({ customerId, limit = 10 }: SearchHistoryListProps) {
  const router = useRouter();
  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, limit]);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: String(limit),
      });

      const response = await fetch(`/api/customers/${customerId}/search-history?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Eroare la încărcarea istoricului');
      }

      const data = await response.json();
      setSearches(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAgain = (search: SearchHistoryItem) => {
    // Build URL with search parameters
    const params = new URLSearchParams();

    if (search.search_query) {
      params.set('search', search.search_query);
    }
    if (search.service_category_id) {
      params.set('service_id', search.service_category_id.toString());
    }
    if (search.city_id) {
      params.set('city_id', search.city_id.toString());
    }
    if (search.region_id) {
      params.set('region_id', search.region_id.toString());
    }

    // Navigate to search page with parameters
    router.push(`/instalatori?${params.toString()}`);
  };

  const getSearchDisplayText = (search: SearchHistoryItem) => {
    const parts: string[] = [];

    if (search.search_query) {
      parts.push(`"${search.search_query}"`);
    }

    if (search.service_name) {
      parts.push(search.service_name);
    }

    if (search.city_name) {
      parts.push(search.city_name);
    } else if (search.region_name) {
      parts.push(search.region_name);
    }

    if (parts.length === 0) {
      return 'Căutare generală';
    }

    return parts.join(' în ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Istoric Căutări</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Căutările dumneavoastră recente
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-3 text-sm">Se încarcă istoricul...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchSearchHistory} className="mt-3">
              Încearcă din nou
            </Button>
          </div>
        )}

        {!isLoading && !error && searches.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Niciun istoric de căutări
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Începeți să căutați instalatori pentru a vedea istoricul!
            </p>
            <Link href="/instalatori">
              <Button size="sm">Găsește Instalatori</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && searches.length > 0 && (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Search Display Text */}
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0"
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
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getSearchDisplayText(search)}
                        </p>

                        {/* Filter Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {search.search_query && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {search.search_query}
                            </span>
                          )}
                          {search.service_name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {search.service_name}
                            </span>
                          )}
                          {search.city_name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {search.city_name}
                            </span>
                          )}
                        </div>

                        {/* Results & Date */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{formatNumber(search.results_count)} rezultate</span>
                          <span>•</span>
                          <span>{formatDate(new Date(search.created_at))}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search Again Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchAgain(search)}
                    className="ml-3 flex-shrink-0"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Repetă
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
