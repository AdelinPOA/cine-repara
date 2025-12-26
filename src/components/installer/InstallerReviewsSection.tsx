'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReviewCard } from '@/components/review/ReviewCard';

interface ReviewWithDetails {
  id: string;
  rating: number;
  title: string;
  comment: string;
  work_completed_at?: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at?: string;
  customer_name: string;
  customer_avatar?: string;
  service_name: string;
  service_slug: string;
  images?: Array<{
    id: string;
    image_url: string;
    caption?: string;
    display_order: number;
  }>;
}

interface InstallerReviewsSectionProps {
  installerId: string;
  limit?: number;
}

export function InstallerReviewsSection({ installerId, limit = 5 }: InstallerReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installerId, limit]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: String(limit),
        sort: 'newest',
      });

      const response = await fetch(
        `/api/installers/${installerId}/reviews?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Eroare la încărcarea recenziilor');
      }

      const data = await response.json();
      setReviews(data.data || []);
      setTotalReviews(data.stats?.total_reviews || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    // TODO: Implement helpful vote functionality
    console.log('Helpful clicked for review:', reviewId);
  };

  // Generate profile slug for "View All" link
  const profileSlug = `installer-${installerId.substring(0, 8)}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recenzii Recente</CardTitle>
          {totalReviews > limit && (
            <Link href={`/instalatori/${profileSlug}#recenzii`}>
              <Button variant="outline" size="sm">
                Vezi toate ({totalReviews})
              </Button>
            </Link>
          )}
        </div>
        {totalReviews > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Ultimele {Math.min(limit, totalReviews)} din {totalReviews} recenzii
          </p>
        )}
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
            <svg
              className="mx-auto h-10 w-10 text-red-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReviews}
              className="mt-3"
            >
              Încearcă din nou
            </Button>
          </div>
        )}

        {!isLoading && !error && totalReviews === 0 && (
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Încă nu aveți recenzii
            </h3>
            <p className="text-sm text-gray-600">
              Încurajați clienții să lase feedback pentru serviciile oferite!
            </p>
          </div>
        )}

        {!isLoading && !error && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
