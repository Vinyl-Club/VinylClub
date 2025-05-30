import {  useCallback, useEffect, useState } from 'react';
import { Address } from '../types/index';

export function useAddresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAddresses = useCallback(async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8090/api/addresses', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
    
                const data = await response.json();
                setAddresses(Array.isArray(data) ? data : data.content);
            } catch (err: any) {
                setError(err);
                console.error('Erreur lors du chargement des produits:', err);
            } finally {
                setLoading(false);
            }
        }, []);
    
        useEffect(() => {
            fetchAddresses();
        }, [fetchAddresses]);
    
        return { addresses, loading, error };
}