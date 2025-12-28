'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface FavoriteInstaller {
  id: number;
  customer_id: string;
  installer_profile_id: string;
  created_at: string;
  installer_name: string;
  installer_business_name: string | null;
  installer_avatar: string | null;
  installer_verified: boolean;
  installer_rating: number;
  installer_review_count: number;
  primary_service: string | null;
  service_area_count: number;
}

interface FavoritesListProps {
  customerId: string;
  limit?: number;
}

export function FavoritesList({ customerId, limit = 10 }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteInstaller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, limit]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: String(limit),
      });

      const response = await fetch(`/api/customers/${customerId}/favorites?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Eroare la încărcarea favoritelor');
      }

      const data = await response.json();
      setFavorites(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number, installerName: string) => {
    // Optimistic update - remove from UI immediately
    const previousFavorites = [...favorites];
    setFavorites(favorites.filter((fav) => fav.id !== favoriteId));

    try {
      const response = await fetch(`/api/customers/${customerId}/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Eroare la ștergerea favoritului');
      }

      toast.success(`${installerName} a fost șters din favorite`);
    } catch (err) {
      // Revert optimistic update on error
      setFavorites(previousFavorites);
      toast.error(err instanceof Error ? err.message : 'Eroare necunoscută');
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            // Full star
            return (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            // Half star
            return (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#D1D5DB" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            );
          } else {
            // Empty star
            return (
              <svg
                key={index}
                className="w-4 h-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
        })}
        <span className="ml-1 text-sm text-gray-600">
          {rating > 0 ? rating.toFixed(1) : 'Fără rating'}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instalatori Favoriți</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Instalatorii salvați pentru acces rapid
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-3 text-sm">Se încarcă favoritele...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchFavorites} className="mt-3">
              Încearcă din nou
            </Button>
          </div>
        )}

        {!isLoading && !error && favorites.length === 0 && (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Nu aveți instalatori favoriți
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Găsiți instalatori și salvați-i pentru acces rapid!
            </p>
            <Link href="/instalatori">
              <Button size="sm">Găsește Instalatori</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && favorites.length > 0 && (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Header with Installer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {favorite.installer_avatar ? (
                        <img
                          src={favorite.installer_avatar}
                          alt={favorite.installer_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {favorite.installer_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name & Details */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Link
                          href={`/instalatori/${favorite.installer_profile_id.substring(0, 8)}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {favorite.installer_name}
                        </Link>
                        {favorite.installer_verified && (
                          <svg
                            className="w-4 h-4 ml-1 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Primary Service Badge */}
                      {favorite.primary_service && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {favorite.primary_service}
                        </span>
                      )}

                      {/* Rating */}
                      <div className="mt-2">{renderStars(favorite.installer_rating)}</div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{formatNumber(favorite.installer_review_count)} recenzii</span>
                        <span>•</span>
                        <span>{formatNumber(favorite.service_area_count)} zone</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/instalatori/${favorite.installer_profile_id.substring(0, 8)}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Vezi Profil
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFavorite(favorite.id, favorite.installer_name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
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
