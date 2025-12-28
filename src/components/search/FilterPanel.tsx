'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ratingMin, setRatingMin] = useState(searchParams.get('rating_min') || '');
  const [available, setAvailable] = useState(searchParams.get('available') === 'true');

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (ratingMin) {
      params.set('rating_min', ratingMin);
    } else {
      params.delete('rating_min');
    }

    if (available) {
      params.set('available', 'true');
    } else {
      params.delete('available');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`/instalatori?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setRatingMin('');
    setAvailable(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('rating_min');
    params.delete('available');
    params.set('page', '1');

    router.push(`/instalatori?${params.toString()}`);
  };

  const hasActiveFilters = ratingMin || available;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtre</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Rating Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Rating minim</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={ratingMin === String(rating)}
                    onChange={(e) => setRatingMin(e.target.value)}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">și mai mult</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Disponibilitate</h3>
            <Checkbox
              id="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              label="Doar instalatori disponibili"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              className="w-full"
            >
              Aplică filtre
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Șterge filtre
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
