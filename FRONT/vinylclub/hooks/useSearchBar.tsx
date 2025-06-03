import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/types/index';

export function useSearchBar(query: string) {
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSearchResults = useCallback(async () => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8090/api/products/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Product[] = await response.json();
            console.log('Search results:', data);
            setResults(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors de la recherche';
            console.error('Error fetching search results:', e);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    return { results, loading, error };
}