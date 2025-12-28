'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { InstallerWithDetails } from '@/lib/db/schema';

interface InstallerProfilePreviewProps {
  installer: InstallerWithDetails;
}

export function InstallerProfilePreview({ installer }: InstallerProfilePreviewProps) {
  // Generate slug from business name or name
  const slugName = (installer.business_name || installer.name)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const profileSlug = `${slugName}-${installer.id.substring(0, 8)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profilul Dvs.</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Așa vă văd clienții profilul
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Business Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {installer.business_name || installer.name}
              </h3>
              {installer.is_verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verificat
                </span>
              )}
            </div>
          </div>

          {/* Experience */}
          {installer.years_experience && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{installer.years_experience} {installer.years_experience === 1 ? 'an' : 'ani'} experiență</span>
            </div>
          )}

          {/* Bio */}
          {installer.bio && (
            <p className="text-sm text-gray-700 line-clamp-3">
              {installer.bio}
            </p>
          )}
        </div>

        {/* Services */}
        {installer.services && installer.services.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Servicii</h4>
            <div className="flex flex-wrap gap-2">
              {installer.services.slice(0, 5).map((service) => (
                <span
                  key={service.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {service.name_ro}
                </span>
              ))}
              {installer.services.length > 5 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{installer.services.length - 5} mai multe
                </span>
              )}
            </div>
          </div>
        )}

        {/* Service Areas */}
        {installer.service_areas && installer.service_areas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Zone de Acoperire</h4>
            <div className="flex flex-wrap gap-2">
              {installer.service_areas.slice(0, 4).map((city) => (
                <span
                  key={city.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {city.name}
                </span>
              ))}
              {installer.service_areas.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  +{installer.service_areas.length - 4} mai multe
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <Link href={`/instalatori/${profileSlug}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Vezi Profil Public
            </Button>
          </Link>
          <Link href="/dashboard/installer/profile" className="flex-1">
            <Button variant="primary" className="w-full">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editează Profil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
