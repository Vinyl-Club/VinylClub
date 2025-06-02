import { useCallback, useEffect, useState } from 'react';
import { Address } from '../types/index';

export function useAddressesByUser(userId: number | null) {
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAddress = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8090/api/addresses/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // Pas d'adresse trouvée pour cet utilisateur (pas une vraie erreur applicative)
                    setAddress(null);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }
            const data = await response.json();
            console.log(data);
            if (data.length > 0) {
                setAddress(data[0]); // Prendre la première adresse du tableau
            } else {
                setAddress(null);
            }
        } catch (err: any) {
            setError(err);
            console.error('Erreur lors du chargement de l\'adresse utilisateur :', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    return { address, loading, error };
}
