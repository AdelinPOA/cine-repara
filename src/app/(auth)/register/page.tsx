import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creați un cont</CardTitle>
        <CardDescription>
          Alegeți tipul de cont pe care doriți să-l creați
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Registration */}
        <Link href="/register/customer">
          <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600 group-hover:text-white"
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
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Client
                </h3>
                <p className="text-sm text-gray-600">
                  Caut un instalator pentru locuința mea
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Installer Registration */}
        <Link href="/register/installer">
          <div className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Instalator
                </h3>
                <p className="text-sm text-gray-600">
                  Sunt un profesionist și ofer servicii de instalare
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        {/* Login Link */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600">
            Aveți deja cont?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Conectați-vă
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
