'use client';

import { signOut } from 'next-auth/react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { useState } from 'react';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick' | 'isLoading'> {
  redirectTo?: string;
}

export function LogoutButton({
  redirectTo = '/',
  children = 'Deconectare',
  variant = 'ghost',
  ...props
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: redirectTo, redirect: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </Button>
  );
}
