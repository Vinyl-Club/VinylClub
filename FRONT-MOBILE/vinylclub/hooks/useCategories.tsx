import { useEffect, useState, useCallback } from 'react';
import { Categories } from '../types/index';

// Configuration de l'API
// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '{{gateway_url}}';

// Custom hook to fetch categories from API gateway
export function useCategories() {
    // State to store the list of categories
    const [categories, setCategories] = useState<Categories[]>([]);
    // State to manage the loading status
    const [loading, setLoading] = useState(true);
    // State to manage error status
    const [error, setError] = useState<string | null>(null);

    // Function to fetch categories from API
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:8090/api/categories', {
            // const response = await fetch('http://192.168.12.214:8083/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Ajoutez l'authentification si nécessaire
                    // 'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
            }

            const data: Categories[] = await response.json();
            console.log('Categories fetched:', data);
            setCategories(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors du chargement des catégories';
            console.error('Error loading categories:', e);
            setError(errorMessage);
            
            // In the event of an error, you can keep Fallback data
            // or leave an empty table according to your needs
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Function to manually refresh the data
    const refetch = useCallback(() => {
        return fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch
    };
}