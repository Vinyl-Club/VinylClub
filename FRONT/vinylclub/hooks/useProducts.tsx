import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/types/index';

export default function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8090/api/products', {
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
            setProducts(Array.isArray(data) ? data : data.content);
        } catch (err: any) {
            setError(err);
            console.error('Erreur lors du chargement des produits:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error };
}
