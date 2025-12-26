'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function SearchHistoryPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Istoric Căutări</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Accesați rapid căutările anterioare
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-200">
          <svg
            className="mx-auto h-12 w-12 text-green-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            În Curând!
          </h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
            Funcționalitatea de istoric al căutărilor va fi disponibilă în curând.
            Veți putea revizita rapid căutările anterioare pentru instalatori.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
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
