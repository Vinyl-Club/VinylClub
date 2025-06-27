// hooks/useFavorites.ts
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { API_URL } from '@/constants/config';

// Service pour les favoris
const FavoritesService = {
  async toggleFavorite(userId: string, productId: number) {
    try {
      const response = await fetch(`${API_URL}/api/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId.toString()
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      return null;
    }
  },

  async checkFavorite(userId: string, productId: number) {
    try {
      const response = await fetch(`${API_URL}/api/favorites/check/${userId}/${productId}`);
      const data = await response.json();
      return data.isFavorite;
    } catch (error) {
      console.error('Erreur check favori:', error);
      return false;
    }
  }
};

export const useFavorites = (productId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loadUser } = useUser();

  // Debug pour vérifier l'état de l'utilisateur
  useEffect(() => {
    console.log('useFavorites - User state:', {
      user: user,
      userId: user?.id,
      productId: productId
    });
  }, [user, productId]);

  // Charger l'utilisateur si pas encore fait
  useEffect(() => {
    if (!user) {
      console.log('useFavorites - Chargement de l\'utilisateur...');
      loadUser();
    }
  }, [user, loadUser]);

  // Vérifier le statut favori au chargement
  useEffect(() => {
    if (user?.id && productId) {
      console.log('useFavorites - Vérification statut favori pour:', user.id, productId);
      checkFavoriteStatus();
    }
  }, [user?.id, productId]);

  const checkFavoriteStatus = async () => {
    if (user?.id && productId) {
      const status = await FavoritesService.checkFavorite(user.id.toString(), productId);
      console.log('useFavorites - Statut favori:', status);
      setIsFavorite(status);
    }
  };

  const toggleFavorite = async () => {
    if (loading || !user?.id) {
      console.log('useFavorites - Toggle bloqué:', { loading, userId: user?.id });
      return;
    }
    
    setLoading(true);
    try {
      console.log('useFavorites - Toggle favori pour:', user.id, productId);
      const result = await FavoritesService.toggleFavorite(user.id.toString(), productId);
      console.log('useFavorites - Résultat toggle:', result);
      if (result && result.success) {
        setIsFavorite(result.isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    loading,
    toggleFavorite,
    user,
    isReady: !!user // Indique si l'utilisateur est chargé
  };
};