import { useCallback, useEffect, useState } from 'react';
import { Address } from '../types/index';

export function useAddressesByUser(userId: number | null) {
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchAddress = async () => {
        try {
            const res = await fetch(`http://localhost:8090/api/addresses/user/${userId}`, );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log(data)
            setAddress(data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
        };

        fetchAddress();
    }, [userId]);

    return { address, loading, error };
}

