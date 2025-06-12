import { useCallback, useState } from 'react';
import { User } from '../types';
import { useAuth } from './useAuth';

export function useUser() {
    const { fetchCurrentUser, getTokens } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // ✅ Chargement manuel de l'utilisateur
    const loadUser = useCallback(async () => {
        setLoading(true);
        try {
        const { accessToken } = await getTokens();
        if (!accessToken) throw new Error('Aucun token d’accès disponible');
        const freshUser = await fetchCurrentUser(accessToken);
        if (freshUser) setUser(freshUser);
        } catch (err: any) {
        console.error('❌ Erreur loadUser:', err);
        setError(err);
        } finally {
        setLoading(false);
        }
    }, [fetchCurrentUser, getTokens]);

    // ✅ Mise à jour
    const updateUser = useCallback(async (updates: Partial<User>) => {
  if (!user) return;

  const payload = {
    id: user.id,
    firstName: updates.firstName ?? user.firstName,
    lastName:  updates.lastName  ?? user.lastName,
    email:     user.email,       // inclure l’email
    phone:     updates.phone     ?? user.phone,
  };

  console.log('▶️ payload full user:', payload);
  const { accessToken } = await getTokens();
  const response = await fetch(`http://localhost:8090/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  // …
}, [user, getTokens]);


    return { user, loading, error, updateUser, loadUser };
}
