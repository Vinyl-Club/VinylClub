// Import necessary hooks and types from React and local types
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/types/index';

export default function useProducts() {
    // State to store the list of products
    const [products, setProducts] = useState<Product[]>([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during fetching
    const [error, setError] = useState<Error | null>(null);

    // Define a function to fetch products from the API
    const fetchProducts = useCallback(async () => {
        // Set loading to true when starting to fetch
        setLoading(true);
        try {
            // Fetch data from the API endpoint
            const response = await fetch('http://localhost:8090/api/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            // Check if the response is not OK, throw an error if it's not
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON data from the response
            const data = await response.json();
            // Update the products state with the fetched data
            setProducts(Array.isArray(data) ? data : data.content);
        } catch (err: any) {
            // Set error state if an error occurs during fetching
            setError(err);
            console.error('Error loading products:', err);
        } finally {
            // Set loading to false after fetching is complete, whether successful or not
            setLoading(false);
        }
    }, []);

    // Use the useEffect hook to fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Return the products, loading status, and any error
    return { products, loading, error };
}
