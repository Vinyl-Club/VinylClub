import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store'; // Utilisé pour le stockage sécurisé
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse, AuthState } from '@/types/index';
import { API_URL_AUTH } from '@/constants/config';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // ✅ Force l'utilisation d'AsyncStorage pour éviter les problèmes SecureStore
  const [useAsyncStorage, setUseAsyncStorage] = useState(true);

  // ✅ Clés pour le stockage
  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'user_data';

  // ✅ Tester SecureStore au démarrage (désactivé temporairement)
  useEffect(() => {
    console.log('🔧 Using AsyncStorage fallback due to SecureStore issues');
    // TODO: Réactiver quand SecureStore sera fixé
  }, []);

  // ✅ Sauvegarder les tokens avec fallback
  const saveTokens = async (accessToken: string, refreshToken: string, user: User) => {
    try {
      console.log('💾 Saving tokens...');
      
      if (useAsyncStorage) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log('✅ Tokens saved with AsyncStorage');
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        console.log('✅ Tokens saved with SecureStore');
      }
    } catch (error) {
      console.error('❌ Error saving tokens:', error);
      // Fallback vers AsyncStorage
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log('✅ Tokens saved with AsyncStorage fallback');
      } catch (fallbackError) {
        console.error('💥 All storage methods failed:', fallbackError);
      }
    }
  };

  // ✅ Récupérer les tokens avec fallback
  const getTokens = async () => {
    try {
      console.log('🔍 Getting tokens...');
      let accessToken, refreshToken, userData;

      if (useAsyncStorage) {
        accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        userData = await AsyncStorage.getItem(USER_KEY);
        console.log('📱 Retrieved tokens from AsyncStorage');
      } else {
        accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        userData = await SecureStore.getItemAsync(USER_KEY);
        console.log('🔒 Retrieved tokens from SecureStore');
      }

      const result = {
        accessToken,
        refreshToken,
        user: userData ? JSON.parse(userData) : null,
      };
      
      console.log('📋 Tokens retrieved:', { 
        hasAccessToken: !!result.accessToken, 
        hasRefreshToken: !!result.refreshToken, 
        hasUser: !!result.user 
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error getting tokens:', error);
      // Fallback vers AsyncStorage
      try {
        const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        const userData = await AsyncStorage.getItem(USER_KEY);
        
        console.log('🔄 Retrieved tokens from AsyncStorage fallback');
        return {
          accessToken,
          refreshToken,
          user: userData ? JSON.parse(userData) : null,
        };
      } catch (fallbackError) {
        console.error('💥 All storage retrieval methods failed:', fallbackError);
        return { accessToken: null, refreshToken: null, user: null };
      }
    }
  };

  // ✅ Supprimer les tokens avec fallback
  const clearTokens = async () => {
    try {
      console.log('🗑️ Clearing tokens...');
      
      if (useAsyncStorage) {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
        console.log('✅ Tokens cleared from AsyncStorage');
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        console.log('✅ Tokens cleared from SecureStore');
      }
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
      // Fallback vers AsyncStorage
      try {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
        console.log('✅ Tokens cleared from AsyncStorage fallback');
      } catch (fallbackError) {
        console.error('💥 All token clearing methods failed:', fallbackError);
      }
    }
  };

  // ✅ Faire une requête avec auto-refresh
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    console.log('🌐 Making authenticated request to:', url);
    const { accessToken, refreshToken } = await getTokens();
    
    if (!accessToken) {
      console.error('❌ No access token available');
      throw new Error('No access token available');
    }

    // Premier essai avec le access token
    console.log('📡 First attempt with access token');
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Response status:', response.status);

    // Si le token a expiré, essayer de le rafraîchir
    if (response.status === 401 && refreshToken) {
      console.log('🔄 Token expired, trying to refresh...');
      const newTokens = await refreshTokens(refreshToken);
      if (newTokens) {
        console.log('✅ Token refreshed, retrying request');
        // Retry avec le nouveau token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newTokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return response;
  };

  // ✅ Rafraîchir les tokens
  const refreshTokens = async (refreshToken: string): Promise<LoginResponse | null> => {
    try {
      console.log('🔄 Refreshing tokens...');
      const response = await fetch(`${API_URL_AUTH}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('📥 Refresh response status:', response.status);

      if (response.ok) {
        const data: LoginResponse = await response.json();
        console.log('✅ Tokens refreshed successfully');
        await saveTokens(data.accessToken, data.refreshToken, data.user);
        
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return data;
      } else {
        console.log('❌ Refresh token invalid, logging out');
        // Refresh token invalide, déconnecter
        await logout();
        return null;
      }
    } catch (error) {
      console.error('💥 Error refreshing tokens:', error);
      await logout();
      return null;
    }
  };

  // ✅ Connexion avec logs détaillés
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Starting login process...');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('📡 API URL:', `${API_URL_AUTH}/login`);
      
      setAuthState(prev => ({ ...prev, isLoading: true }));

      console.log('📤 Sending login request...');
      const response = await fetch(`${API_URL_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(`📤 Request body: ${JSON.stringify({ email, password })}`);
      console.log('📥 Login response status:', response.status);
    

      if (response.ok) {
        console.log('✅ Login response OK, parsing JSON...');
        const data: LoginResponse = await response.json();
        console.log('data : ',data);
        console.log('📦 Login data received:', {
          hasAccessToken: !!data.accessToken,
          hasRefreshToken: !!data.refreshToken,
          hasUser: !!data.user,
          user: data.user
        });
        
        await saveTokens(data.accessToken, data.refreshToken, data.user);
        
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        
        console.log('🎉 Login successful!');
        return true;
      } else {
        console.log('❌ Login failed with status:', response.status);
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return false;
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      console.error('💥 Error type:', typeof error);
      console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  };

  // ✅ Déconnexion
  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      // Optionnel : appeler l'endpoint logout
      const { accessToken } = await getTokens();
      if (accessToken) {
        console.log('📤 Calling logout endpoint...');
        fetch(`${API_URL_AUTH}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }).catch(() => {}); // Ignore les erreurs
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      await clearTokens();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      console.log('✅ Logout completed');
    }
  };

  // ✅ Vérifier l'authentification au démarrage
  const checkAuthState = useCallback(async () => {
    try {
      console.log('🔍 Checking auth state...');
      const { accessToken, user } = await getTokens();
      
      if (accessToken && user) {
        console.log('🔑 Found stored tokens, validating...');
        // Vérifier si le token est toujours valide
        const response = await fetch(`${API_URL_AUTH}/validate`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log('📥 Validation response status:', response.status);

        if (response.ok) {
          console.log('✅ Token is valid, user authenticated');
          setAuthState({
            user: user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          console.log('❌ Token invalid, trying to refresh...');
          // Token invalide, essayer de rafraîchir
          const { refreshToken } = await getTokens();
          if (refreshToken) {
            const newTokens = await refreshTokens(refreshToken);
            if (!newTokens) {
              console.log('❌ Refresh failed, clearing tokens');
              await clearTokens();
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
              });
            }
          } else {
            console.log('❌ No refresh token, clearing tokens');
            await clearTokens();
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        }
      } else {
        console.log('🔍 No stored tokens found');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('💥 Auth state check error:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // ✅ Vérifier l'état d'authentification au montage du composant
  useEffect(() => {
    console.log('🔧 useAuth hook mounted, checking auth state...');
    checkAuthState();
  }, [checkAuthState]);

  // ✅ Configuration automatique du refresh token
  useEffect(() => {
    if (!authState.isAuthenticated) {
      console.log('⏱️ User not authenticated, skipping refresh timer');
      return;
    }

    console.log('⏱️ Setting up token refresh timer (55 minutes)');
    // Rafraîchir le token 5 minutes avant expiration
    const refreshInterval = setInterval(async () => {
      console.log('⏰ Auto-refresh triggered');
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        await refreshTokens(refreshToken);
      }
    }, 55 * 60 * 1000); // 55 minutes

    return () => {
      console.log('⏱️ Clearing refresh timer');
      clearInterval(refreshInterval);
    };
  }, [authState.isAuthenticated]);

  return {
    // État
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    
    // Actions
    login,
    logout,
    
    // Utilitaires
    makeAuthenticatedRequest,
    refreshTokens: async () => {
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        return await refreshTokens(refreshToken);
      }
      return null;
    },
    
    // Vérification manuelle de l'état
    checkAuthState,
  };
};