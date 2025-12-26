import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Pagina nu a fost găsită
        </h2>

        <p className="text-gray-600 mb-8">
          Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Înapoi acasă</Button>
          </Link>

          <Link href="/instalatori">
            <Button variant="outline">Caută instalatori</Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Link-uri utile:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/servicii" className="text-blue-600 hover:underline">
              Servicii
            </Link>
            <Link href="/instalatori" className="text-blue-600 hover:underline">
              Instalatori
            </Link>
            <Link href="/login" className="text-blue-600 hover:underline">
              Conectare
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Înregistrare
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
