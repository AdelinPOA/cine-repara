'use client';

import { useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { ReviewStats } from './ReviewStats';

interface ReviewListProps {
  installerId: string;
}

export function ReviewList({ installerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, [installerId, currentPage, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(currentPage),
        sort: sortBy,
      });

      if (filterRating) {
        params.set('rating', filterRating);
      }

      const response = await fetch(
        `/api/installers/${installerId}/reviews?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Eroare la încărcarea recenziilor');
      }

      const data = await response.json();
      setReviews(data.data);
      setStats(data.stats);
      setPagination(data.pagination);
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

  if (isLoading && !stats) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Se încarcă recenziile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats || stats.total_reviews === 0) {
    return (
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
        <p className="text-gray-600">Acest instalator nu are încă recenzii</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <ReviewStats
        averageRating={stats.average_rating}
        totalReviews={stats.total_reviews}
        distribution={stats.distribution}
      />

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filter by rating */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-rating" className="text-sm text-gray-700">
            Filtrează:
          </label>
          <select
            id="filter-rating"
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toate rating-urile</option>
            <option value="5">5 stele</option>
            <option value="4">4 stele</option>
            <option value="3">3 stele</option>
            <option value="2">2 stele</option>
            <option value="1">1 stea</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-reviews" className="text-sm text-gray-700">
            Sortează:
          </label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Cele mai recente</option>
            <option value="highest">Rating cel mai mare</option>
            <option value="lowest">Rating cel mai mic</option>
            <option value="helpful">Cele mai utile</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700">
            Pagina {currentPage} din {pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Următor
          </button>
        </div>
      )}
    </div>
  );
}
