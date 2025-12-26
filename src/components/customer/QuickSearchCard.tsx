'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function QuickSearchCard() {
  const popularCategories = [
    { name: 'Instalații Termice', slug: 'instalatii-termice', icon: '🔥' },
    { name: 'Instalații Electrice', slug: 'instalatii-electrice', icon: '⚡' },
    { name: 'Instalații Sanitare', slug: 'instalatii-sanitare', icon: '🚰' },
    { name: 'Climatizare', slug: 'climatizare', icon: '❄️' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Găsiți Instalatori
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Căutați instalatori profesioniști în zona dumneavoastră
        </p>

        {/* Main Search Button */}
        <Link href="/instalatori" className="block">
          <Button className="w-full" size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explorează Toți Instalatorii
          </Button>
        </Link>

        {/* Popular Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Categorii Populare:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {popularCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/instalatori?serviciu=${category.slug}`}
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-2">
              <p className="text-xs font-medium text-blue-900">
                Sfat:
              </p>
              <p className="text-xs text-blue-800 mt-0.5">
                Filtrați după locație și rating pentru cei mai buni instalatori din zona dvs.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
