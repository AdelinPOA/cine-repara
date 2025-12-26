'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const validatedData = loginSchema.parse(formData);

      // Sign in with credentials
      const result = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (result?.error) {
        setGeneralError('Email sau parolă incorectă');
      } else if (result?.ok) {
        // Redirect will be handled by middleware
        router.push('/dashboard');
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
        <CardTitle>Autentificare</CardTitle>
        <CardDescription>
          Introduceți datele dumneavoastră pentru a vă conecta
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
            <Label htmlFor="password" required>
              Parolă
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Introduceți parola"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Ați uitat parola?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Conectare
          </Button>

          <div className="text-sm text-center text-gray-600">
            Nu aveți cont?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Înregistrați-vă
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
