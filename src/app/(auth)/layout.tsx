import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Cine Repara
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Cine Repara. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
