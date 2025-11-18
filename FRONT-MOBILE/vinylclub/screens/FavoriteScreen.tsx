import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { API_URL } from '@/constants/config';

// Service for favorite actions (toggle/check)
export const FavoriteScreen = {
  // Toggle favorite status for a product and user
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

  // Check if a product is a favorite for a user
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

// Custom hook to manage favorite state for a product
export const useFavorites = (productId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loadUser } = useUser();

  // Load user if not already loaded
  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user, loadUser]);

  // Check favorite status when user or product changes
  useEffect(() => {
    if (user?.id && productId) {
      checkFavoriteStatus();
    }
  }, [user?.id, productId]);

  // Check favorite status from API
  const checkFavoriteStatus = async () => {
    if (user?.id && productId) {
      const status = await FavoriteScreen.checkFavorite(user.id.toString(), productId);
      setIsFavorite(status);
    }
  };

  // Toggle favorite status and update state
  const toggleFavorite = async () => {
    if (loading || !user?.id) {
      return;
    }
    setLoading(true);
    try {
      const result = await FavoriteScreen.toggleFavorite(user.id.toString(), productId);
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
    isFavorite,      // Current favorite status
    loading,         // Loading state for toggle action
    toggleFavorite,  // Function to toggle favorite
    user,            // Current user
    isReady: !!user  // Indicates if user is loaded
  };
};
