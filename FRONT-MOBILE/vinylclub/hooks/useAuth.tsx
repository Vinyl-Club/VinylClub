import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginResponse, AuthState } from '@/types/index';
import { API_URL_AUTH } from '@/constants/config';

// Custom authentication hook
export const useAuth = () => {
  // Auth state management
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Force AsyncStorage usage due to SecureStore issues
  const [useAsyncStorage, setUseAsyncStorage] = useState(true);

  // Storage keys
  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'user_data';

  useEffect(() => {
    // Using AsyncStorage fallback
    console.log('🔧 Using AsyncStorage fallback due to SecureStore issues');
  }, []);

  // Save tokens to storage (with fallback)
  const saveTokens = async (accessToken: string, refreshToken: string, user: User) => {
    try {
      if (useAsyncStorage) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (fallbackError) {}
    }
  };

  // Retrieve tokens from storage (with fallback)
  const getTokens = async () => {
    try {
      let accessToken, refreshToken, userData;
      if (useAsyncStorage) {
        accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        userData = await AsyncStorage.getItem(USER_KEY);
      } else {
        accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        userData = await SecureStore.getItemAsync(USER_KEY);
      }
      return {
        accessToken,
        refreshToken,
        user: userData ? JSON.parse(userData) : null,
      };
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      try {
        const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        const userData = await AsyncStorage.getItem(USER_KEY);
        return {
          accessToken,
          refreshToken,
          user: userData ? JSON.parse(userData) : null,
        };
      } catch (fallbackError) {
        return { accessToken: null, refreshToken: null, user: null };
      }
    }
  };

  // Remove tokens from storage (with fallback)
  const clearTokens = async () => {
    try {
      if (useAsyncStorage) {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      try {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } catch (fallbackError) {}
    }
  };

  // Make authenticated API request, auto-refreshing token if needed
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const { accessToken, refreshToken } = await getTokens();
    if (!accessToken) throw new Error('No access token available');
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    // If token expired, try to refresh and retry
    if (response.status === 401 && refreshToken) {
      const newTokens = await refreshTokens(refreshToken);
      if (newTokens) {
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

  // Refresh tokens using refresh token
  const refreshTokens = async (refreshToken: string): Promise<LoginResponse | null> => {
    try {
      const response = await fetch(`${API_URL_AUTH}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data: LoginResponse = await response.json();
        await saveTokens(data.accessToken, data.refreshToken, data.user);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return data;
      } else {
        // Invalid refresh token, logout
        await logout();
        return null;
      }
    } catch (error) {
      await logout();
      return null;
    }
  };

  // Login user and store tokens
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch(`${API_URL_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data: LoginResponse = await response.json();
        await saveTokens(data.accessToken, data.refreshToken, data.user);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return false;
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  };

  // Logout user and clear tokens
  const logout = async () => {
    try {
      const { accessToken } = await getTokens();
      if (accessToken) {
        fetch(`${API_URL_AUTH}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }).catch(() => {});
      }
    } catch (error) {
    } finally {
      await clearTokens();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  // Fetch current user from API
  const fetchCurrentUser = async (accessToken: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL_AUTH}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const user: User = await response.json();
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Check authentication state on startup
  const checkAuthState = useCallback(async () => {
    try {
      const { accessToken, refreshToken } = await getTokens();
      if (accessToken) {
        // Validate access token
        const response = await fetch(`${API_URL_AUTH}/validate`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          // Token valid, fetch user
          const freshUser = await fetchCurrentUser(accessToken);
          if (freshUser) {
            await saveTokens(accessToken, refreshToken!, freshUser);
            setAuthState({
              user: freshUser,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            await clearTokens();
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } else {
          // Try to refresh if token invalid
          if (refreshToken) {
            const newTokens = await refreshTokens(refreshToken);
            if (!newTokens) {
              await clearTokens();
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
              });
            }
          } else {
            await clearTokens();
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // Setup auto-refresh for tokens
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    const refreshInterval = setInterval(async () => {
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        await refreshTokens(refreshToken);
      }
    }, 55 * 60 * 1000); // 55 minutes
    return () => {
      clearInterval(refreshInterval);
    };
  }, [authState.isAuthenticated]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
    makeAuthenticatedRequest,
    refreshTokens: async () => {
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        return await refreshTokens(refreshToken);
      }
      return null;
    },
    checkAuthState,
    fetchCurrentUser,
    getTokens,
    saveTokens,
  };
};
