'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function FavoritesPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instalatori Favoriți</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Salvați instalatorii preferați pentru mai târziu
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
          <svg
            className="mx-auto h-12 w-12 text-blue-400 mb-4"
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
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            În Curând!
          </h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
            Funcționalitatea de salvare a instalatorilor favoriți va fi disponibilă în curând.
            Veți putea crea o listă personalizată cu instalatorii pe care îi apreciați.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            În Dezvoltare
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
