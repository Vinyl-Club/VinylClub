// hooks/useUserFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { Product } from '@/types/index';
import { API_URL } from '@/constants/config';

interface FavoriteReference {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export const useUserFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loadUser } = useUser();

  // Fetch product details by productId
  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  // Fetch user's favorite products
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Get favorite references for the user
      const favoritesResponse = await fetch(`${API_URL}/api/favorites/${user.id}`);
      if (!favoritesResponse.ok) {
        throw new Error(`Erreur HTTP: ${favoritesResponse.status}`);
      }
      const favoriteReferences: FavoriteReference[] = await favoritesResponse.json();
      if (!Array.isArray(favoriteReferences) || favoriteReferences.length === 0) {
        setFavorites([]);
        return;
      }
      // Step 2: Fetch details for each favorite product
      const productPromises = favoriteReferences.map(fav => 
        fetchProductDetails(fav.productId)
      );
      const products = await Promise.all(productPromises);
      // Filter out null products (deleted or not found)
      const validProducts = products.filter((product): product is Product => 
        product !== null && product !== undefined
      );
      setFavorites(validProducts);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Ensure user is loaded before fetching favorites
  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user, loadUser]);

  // Fetch favorites when user is available
  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id, fetchFavorites]);

  // Remove a favorite from the local list
  const removeFavoriteFromList = useCallback((productId: number) => {
    setFavorites(prev => prev.filter(product => product.id !== productId));
  }, []);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    removeFavoriteFromList,
    user
  };
};
