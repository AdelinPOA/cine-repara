import { RatingDisplay } from './RatingDisplay';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';

interface ReviewImage {
  id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

interface ReviewCardProps {
  review: {
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
    images?: ReviewImage[];
  };
  onHelpful?: (reviewId: string) => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {review.customer_avatar ? (
              <img
                src={review.customer_avatar}
                alt={review.customer_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          {/* Customer Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{review.customer_name}</h4>
              {review.is_verified && (
                <Badge variant="success" className="text-xs">
                  Verificat
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{formatDate(review.created_at)}</span>
              <span>•</span>
              <span>{review.service_name}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <RatingDisplay rating={review.rating} size="sm" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Work Completion Date */}
      {review.work_completed_at && (
        <p className="text-sm text-gray-600 mb-4">
          Lucrare finalizată:{' '}
          {formatDate(review.work_completed_at)}
        </p>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {review.images.map((image) => (
            <div
              key={image.id}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={image.image_url}
                alt={image.caption || 'Imagine recenzie'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {/* Helpful Button */}
          {onHelpful && (
            <button
              onClick={() => onHelpful(review.id)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Util ({review.helpful_count})
            </button>
          )}
        </div>

        {/* Updated indicator */}
        {review.updated_at && review.updated_at !== review.created_at && (
          <span className="text-xs text-gray-500">
            Modificat: {formatDate(review.updated_at)}
          </span>
        )}
      </div>
    </div>
  );
}
