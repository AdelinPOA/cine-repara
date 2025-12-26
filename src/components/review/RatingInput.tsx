'use client';

import { useState } from 'react';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, error, disabled }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || value;

  return (
    <div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={`transition-transform ${
              !disabled ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
            }`}
            aria-label={`${rating} stele`}
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                rating <= displayRating ? 'text-yellow-400' : 'text-gray-300'
              } ${disabled ? 'opacity-50' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm font-medium text-gray-700">
            {value} {value === 1 ? 'stea' : 'stele'}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
