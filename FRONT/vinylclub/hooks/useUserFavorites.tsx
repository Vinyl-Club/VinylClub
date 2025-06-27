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

  // Fonction pour récupérer les détails d'un produit
  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`);
      if (!response.ok) {
        console.warn(`Produit ${productId} non trouvé`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
      return null;
    }
  };

  // Fonction pour récupérer les favoris
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      console.log('useUserFavorites - Pas d\'utilisateur connecté');
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('useUserFavorites - Récupération des favoris pour:', user.id);
      
      // Étape 1: Récupérer les références des favoris
      const favoritesResponse = await fetch(`${API_URL}/api/favorites/${user.id}`);
      
      if (!favoritesResponse.ok) {
        throw new Error(`Erreur HTTP: ${favoritesResponse.status}`);
      }
      
      const favoriteReferences: FavoriteReference[] = await favoritesResponse.json();
      console.log('useUserFavorites - Références favoris récupérées:', favoriteReferences);
      
      if (!Array.isArray(favoriteReferences) || favoriteReferences.length === 0) {
        console.log('useUserFavorites - Aucun favori trouvé');
        setFavorites([]);
        return;
      }
      
      // Étape 2: Récupérer les détails de chaque produit
      console.log('useUserFavorites - Récupération des détails des produits...');
      const productPromises = favoriteReferences.map(fav => 
        fetchProductDetails(fav.productId)
      );
      
      const products = await Promise.all(productPromises);
      
      // Filtrer les produits null (produits supprimés ou non trouvés)
      const validProducts = products.filter((product): product is Product => 
        product !== null && product !== undefined
      );
      
      console.log('useUserFavorites - Produits favoris récupérés:', validProducts);
      setFavorites(validProducts);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger l'utilisateur si pas encore fait
  useEffect(() => {
    if (!user) {
      console.log('useUserFavorites - Chargement de l\'utilisateur...');
      loadUser();
    }
  }, [user, loadUser]);

  // Charger les favoris quand l'utilisateur est disponible
  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id, fetchFavorites]);

  // Fonction pour supprimer un favori de la liste locale
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