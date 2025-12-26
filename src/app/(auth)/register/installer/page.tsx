'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { registerUser } from '@/lib/actions/auth';
import { registerSchema } from '@/lib/validations/auth';

export default function InstallerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'installer' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setIsLoading(true);

    try {
      // Validate form
      const validatedData = registerSchema.parse(formData);

      // Register user
      const result = await registerUser(validatedData);

      if (result.error) {
        setGeneralError(result.error);
      } else if (result.success) {
        // Redirect to installer dashboard with profile completion prompt
        router.push('/dashboard/installer/profile');
        router.refresh();
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError('A apărut o eroare. Vă rugăm să încercați din nou.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Link
            href="/register"
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <CardTitle>Înregistrare Instalator</CardTitle>
        </div>
        <CardDescription>
          Creați un cont profesional pentru a oferi servicii de instalare
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {generalError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              {generalError}
            </div>
          )}

          <div>
            <Label htmlFor="name" required>
              Nume complet
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ion Popescu"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplu.ro"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="phone" required>
              Telefon
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0712345678"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              disabled={isLoading}
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-gray-500">
              Numărul de telefon va fi vizibil clienților potențiali
            </p>
          </div>

          <div>
            <Label htmlFor="password" required>
              Parolă
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 caractere"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-500">
              Trebuie să conțină cel puțin o literă mare, o literă mică și o cifră
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" required>
              Confirmă parola
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Introduceți parola din nou"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Următorii pași:</p>
                <p>După înregistrare, va trebui să completați profilul cu informații despre serviciile oferite, zona de acoperire și experiența dumneavoastră.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-600">
              Prin crearea unui cont, sunteți de acord cu{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Termenii și Condițiile
              </Link>{' '}
              și{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Politica de Confidențialitate
              </Link>
              .
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Creează cont profesional
          </Button>

          <div className="text-sm text-center text-gray-600">
            Aveți deja cont?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Conectați-vă
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
