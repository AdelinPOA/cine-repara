import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HomeSearchBar } from '@/components/search/HomeSearchBar';
import { auth } from '@/lib/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Cine Repara</h1>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link href={`/dashboard/${session.user.role}`}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Conectare</Button>
                </Link>
                <Link href="/register">
                  <Button>Înregistrare</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Welcome Banner - Only for authenticated users */}
      {session?.user && (
        <div className="w-full bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-blue-900 font-medium">
              {session.user.name
                ? `Bine ai revenit, ${session.user.name}!`
                : 'Bine ai revenit!'}
            </p>
            <Link href={`/dashboard/${session.user.role}`}>
              <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                Mergi la Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Găsiți instalatori de încredere în România
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cine Repara vă conectează cu instalatori profesioniști verificați pentru toate nevoile dumneavoastră de instalare și reparații.
          </p>

          {/* Search Bar */}
          <div className="mb-12">
            <HomeSearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/instalatori">
              <Button size="lg" className="w-full sm:w-auto">
                Caută instalatori
              </Button>
            </Link>
            <Link href="/register/installer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sunt instalator
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Căutare ușoară</h3>
              <p className="text-gray-600 text-sm">
                Găsiți rapid instalatori în zona dumneavoastră după serviciu și locație
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verificați și de încredere</h3>
              <p className="text-gray-600 text-sm">
                Toți instalatorii sunt verificați cu recenzii și rating-uri reale
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Acoperire națională</h3>
              <p className="text-gray-600 text-sm">
                Instalatori în toate județele din România
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2024 Cine Repara. Toate drepturile rezervate.</p>
          <p className="mt-2 text-xs text-gray-500">
            Marketplace-ul este în curs de dezvoltare - Faza 6 completă (Polish & Optimization)
          </p>
        </div>
      </footer>
    </div>
  );
}
