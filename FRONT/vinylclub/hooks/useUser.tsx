import { useCallback, useState } from 'react';
import { User } from '../types';
import { useAuth } from './useAuth';

/**
 * Hook to load, update, and delete the current user.
 */
export function useUser() {
  const { fetchCurrentUser, getTokens, logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Manually load the current user using the auth service.
   */
  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const { accessToken } = await getTokens();
      if (!accessToken) throw new Error('No access token available');
      const freshUser = await fetchCurrentUser(accessToken);
      if (freshUser) {
        setUser(freshUser);
      }
    } catch (err: any) {
      console.error('❌ Error loadUser:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser, getTokens]);

  /**
   * Update the current user's profile fields.
   * @param updates Partial fields to update.
   */
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    // Prepare the payload with only updatable fields
    const payload = {
      id:        user.id,
      firstName: updates.firstName ?? user.firstName,
      lastName:  updates.lastName  ?? user.lastName,
      email:     user.email,       // Email is not updatable in this context
      phone:     updates.phone     ?? user.phone,
    };

    try {
      const { accessToken } = await getTokens();
      const response = await fetch(
        `http://localhost:8090/api/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // First get the raw text
      const text = await response.text();
      let updated: User;

      try {
        // If it's valid JSON, parse it
        updated = JSON.parse(text);
      } catch {
        // Otherwise, reconstruct the object from the local payload
        updated = {
          ...user,
          ...payload,
        };
      }

      setUser(updated);
      return updated;

    } catch (err: any) {
      console.error('❌ Error updateUser:', err);
      setError(err);
    }
  }, [user, getTokens]);


  /**
   * Delete the current user account and log out.
   */
  const deleteUser = useCallback(async () => {
    if (!user) throw new Error('No user loaded');

    try {
      const { accessToken } = await getTokens();
      if (!accessToken) throw new Error('No access token available');

      const response = await fetch(
        `http://localhost:8090/api/users/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Upon successful delete, clear user and logout
      await logout();
      setUser(null);
    } catch (err: any) {
      console.error('❌ Error deleteUser:', err);
      setError(err);
      throw err;
    }
  }, [user, getTokens, logout]);

  return {
    user,
    loading,
    error,
    loadUser,
    updateUser,
    deleteUser,
  };
}
