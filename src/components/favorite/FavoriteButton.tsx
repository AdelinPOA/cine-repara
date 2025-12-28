'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface FavoriteButtonProps {
  installerProfileId: string;
  initialIsFavorite: boolean;
  initialFavoriteId: string | null;
  customerId?: string;
  variant: 'icon' | 'full';
  className?: string;
}

export function FavoriteButton({
  installerProfileId,
  initialIsFavorite,
  initialFavoriteId,
  customerId,
  variant,
  className = '',
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteId, setFavoriteId] = useState<string | null>(initialFavoriteId);
  const [isLoading, setIsLoading] = useState(false);

  // Disabled if unauthenticated
  const isDisabled = !customerId;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent card click

    if (isDisabled || isLoading) return;

    // Optimistic update
    const previousState = isFavorite;
    const previousFavoriteId = favoriteId;
    setIsFavorite(!previousState);
    setIsLoading(true);

    try {
      if (!previousState) {
        // Add to favorites
        const res = await fetch(`/api/customers/${customerId}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ installer_profile_id: installerProfileId }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            toast.error('Sesiune expirată. Te rugăm să te autentifici.');
            return;
          }
          throw new Error('Failed to add favorite');
        }

        const data = await res.json();
        setFavoriteId(data.data.id.toString());
        toast.success('Adăugat la favorite');
      } else {
        // Remove from favorites
        if (!previousFavoriteId) {
          throw new Error('No favorite ID');
        }

        const res = await fetch(
          `/api/customers/${customerId}/favorites/${previousFavoriteId}`,
          { method: 'DELETE' }
        );

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            toast.error('Sesiune expirată. Te rugăm să te autentifici.');
            return;
          }
          throw new Error('Failed to remove favorite');
        }

        setFavoriteId(null);
        toast.success('Șters din favorite');
      }
    } catch (error) {
      // Revert on error
      setIsFavorite(previousState);
      setFavoriteId(previousFavoriteId);
      toast.error('A apărut o eroare. Încearcă din nou.');
      console.error('Favorite toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Heart icons
  const HeartOutlineIcon = (
    <svg
      className={variant === 'icon' ? 'h-4 w-4' : 'h-5 w-5'}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );

  const HeartFilledIcon = (
    <svg
      className={variant === 'icon' ? 'h-4 w-4' : 'h-5 w-5'}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );

  // Icon variant (for cards)
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        isLoading={isLoading}
        disabled={isDisabled}
        className={`h-8 w-8 rounded-full p-0 ${
          isFavorite
            ? 'text-rose-600 hover:text-rose-700'
            : 'text-zinc-400 hover:text-zinc-600'
        } ${className}`}
        title={isFavorite ? 'Șters din favorite' : 'Adaugă la favorite'}
      >
        {isFavorite ? HeartFilledIcon : HeartOutlineIcon}
      </Button>
    );
  }

  // Full variant (for profile)
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      isLoading={isLoading}
      disabled={isDisabled}
      className={`gap-2 ${
        isFavorite
          ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
          : ''
      } ${className}`}
    >
      {isFavorite ? HeartFilledIcon : HeartOutlineIcon}
      <span>{isFavorite ? 'Șters din favorite' : 'Adaugă la favorite'}</span>
    </Button>
  );
}
