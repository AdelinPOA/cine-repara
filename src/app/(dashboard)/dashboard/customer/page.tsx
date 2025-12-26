import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function CustomerDashboardPage() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bine ați venit, {session?.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Dashboard-ul clientului - în curând
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Găsiți Instalatori</CardTitle>
            <CardDescription>
              Căutați instalatori în zona dumneavoastră
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Funcționalitatea de căutare va fi disponibilă în curând.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recenziile Mele</CardTitle>
            <CardDescription>
              Vedeți și gestionați recenziile lăsate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Nu aveți încă recenzii.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Acest cont a fost creat cu succes!
              </h3>
              <p className="text-sm text-blue-800">
                Dashboard-ul complet al clientului, inclusiv căutarea de instalatori și gestionarea recenziilor, va fi implementat în Faza 2 și 3 ale dezvoltării.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
