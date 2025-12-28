import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { InstallerSummary } from '@/lib/db/schema';
import { generateInstallerSlug } from '@/lib/utils/slugify';
import { formatCount } from '@/lib/utils/format';

interface InstallerCardProps {
  installer: InstallerSummary & {
    services?: Array<{ id: number; name_ro: string; is_primary?: boolean }>;
    cities?: Array<{ id: number; name: string }>;
  };
}

export function InstallerCard({ installer }: InstallerCardProps) {
  // Generate slug for the installer
  const primaryCity = installer.cities?.[0]?.name || 'Romania';
  const slug = generateInstallerSlug(
    installer.business_name || installer.name,
    primaryCity,
    installer.id
  );

  return (
    <Link href={`/instalatori/${slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {installer.business_name || installer.name}
              </h3>
              {installer.business_name && (
                <p className="text-sm text-gray-600">{installer.name}</p>
              )}
            </div>
            {installer.is_verified && (
              <Badge variant="success" className="ml-2">
                Verificat
              </Badge>
            )}
          </div>

          {/* Rating */}
          {installer.review_count > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(installer.average_rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {installer.average_rating.toFixed(1)} ({formatCount(installer.review_count, 'recenzie', 'recenzii')})
              </span>
            </div>
          )}

          {/* Experience */}
          {installer.years_experience && (
            <p className="text-sm text-gray-600 mb-3">
              {installer.years_experience} ani de experiență
            </p>
          )}

          {/* Services */}
          {installer.services && installer.services.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {installer.services.slice(0, 3).map((service) => (
                  <Badge
                    key={service.id}
                    variant={service.is_primary ? 'primary' : 'default'}
                  >
                    {service.name_ro}
                  </Badge>
                ))}
                {installer.services.length > 3 && (
                  <Badge variant="default">
                    +{installer.services.length - 3} mai multe
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {installer.cities && installer.cities.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-1.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {installer.cities.slice(0, 2).map((c) => c.name).join(', ')}
                {installer.cities.length > 2 && ` +${installer.cities.length - 2}`}
              </span>
            </div>
          )}

          {/* Availability */}
          {!installer.is_available && (
            <div className="mt-3">
              <Badge variant="warning">Indisponibil momentan</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
