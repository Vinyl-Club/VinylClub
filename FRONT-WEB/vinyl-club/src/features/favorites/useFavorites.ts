'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavoriteAction } from './actions.server';

type UseFavoritesOptions = {
  productId: number | null | undefined;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
};

export function useFavorites({
  productId,
  initialIsFavorite,
  isAuthenticated,
}: UseFavoritesOptions) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleFavorite() {
    if (isPending) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!Number.isFinite(productId)) {
      setError('Favori invalide.');
      return;
    }

    const previous = isFavorite;
    const next = !previous;

    setIsFavorite(next);
    setIsPending(true);
    setError(null);

    try {
      const result = await toggleFavoriteAction(productId);

      if (!result.ok) {
        setIsFavorite(previous);
        setError(result.message || 'Impossible de mettre a jour ce favori.');

        if (result.requiresLogin) {
          router.push('/login');
        }

        return;
      }

      setIsFavorite(result.isFavorite);
    } catch {
      setIsFavorite(previous);
      setError('Impossible de mettre a jour ce favori.');
    } finally {
      setIsPending(false);
    }
  }

  return {
    isFavorite,
    isPending,
    error,
    toggleFavorite,
  };
}
