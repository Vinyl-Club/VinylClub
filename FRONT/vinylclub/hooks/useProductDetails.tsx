// hooks/useProductDetails.ts
import { useEffect, useState } from 'react';
import { Product } from '@/types/index';

export default function useProductDetails(productId: number) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchProduct() {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8090/api/products/${productId}`);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            const data = await response.json();
            setProduct(data);
        } catch (err: any) {
            console.error('Erreur:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
        }

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
}
