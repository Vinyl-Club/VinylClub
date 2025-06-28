import { useCallback, useEffect, useState } from 'react';
import { Address } from '../types/index';

// Custom hook to fetch the address of a user by userId
export function useAddressesByUser(userId: number | null) {
    const [address, setAddress] = useState<Address | null>(null); // Stores the user's address
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<Error | null>(null); // Error state

    // Fetches the address from the API
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
                    // No address found for this user (not a real error)
                    setAddress(null);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }
            const data = await response.json();
            if (data.length > 0) {
                setAddress(data[0]); // Take the first address from the array
            } else {
                setAddress(null);
            }
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Refetch address when userId changes
    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    return { address, loading, error };
}
