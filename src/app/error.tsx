'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Eroare de server
        </h2>

        <p className="text-gray-600 mb-8">
          Ne pare rău, dar serverul a întâmpinat o eroare. Vă rugăm să încercați din nou.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-xs font-semibold text-red-800 mb-2">
              Detalii eroare (doar în development):
            </p>
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Încearcă din nou
          </Button>

          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Înapoi acasă
          </Button>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Dacă problema persistă, vă rugăm să ne contactați la{' '}
            <a href="mailto:support@cinerepara.ro" className="text-blue-600 hover:underline">
              support@cinerepara.ro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
