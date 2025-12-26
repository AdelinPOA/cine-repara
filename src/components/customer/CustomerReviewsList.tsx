'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/format';

interface CustomerReview {
  id: string;
  installer_profile_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  service_name: string | null;
  created_at: string;
  installer_display_name: string;
  installer_business_name: string | null;
  installer_name: string;
  installer_verified: boolean;
  installer_avatar: string | null;
}

interface CustomerReviewsListProps {
  customerId: string;
  limit?: number;
}

export function CustomerReviewsList({ customerId, limit = 10 }: CustomerReviewsListProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, limit]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: String(limit),
      });

      const response = await fetch(`/api/customers/${customerId}/reviews?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Eroare la încărcarea recenziilor');
      }

      const data = await response.json();
      setReviews(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}.0</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recenziile Mele</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Recenziile pe care le-ați scris instalatorilor
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-3 text-sm">Se încarcă recenziile...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchReviews} className="mt-3">
              Încearcă din nou
            </Button>
          </div>
        )}

        {!isLoading && !error && reviews.length === 0 && (
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Nu ați scris încă recenzii
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Găsiți un instalator și împărtășiți experiența dumneavoastră!
            </p>
            <Link href="/instalatori">
              <Button size="sm">Găsește Instalatori</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Header with Installer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {review.installer_avatar ? (
                        <img
                          src={review.installer_avatar}
                          alt={review.installer_display_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.installer_display_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Installer Name & Service */}
                    <div>
                      <div className="flex items-center">
                        <Link
                          href={`/instalatori/${review.installer_profile_id.substring(0, 8)}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {review.installer_display_name}
                        </Link>
                        {review.installer_verified && (
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
                      {review.service_name && (
                        <p className="text-xs text-gray-500 mt-0.5">{review.service_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-500">
                    {formatDate(new Date(review.created_at))}
                  </span>
                </div>

                {/* Rating */}
                <div className="mb-2">{renderStars(review.rating)}</div>

                {/* Review Content */}
                {review.title && (
                  <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-sm text-gray-700 line-clamp-3">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
