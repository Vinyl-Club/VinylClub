// Import necessary hooks and types from React and local types
import { useEffect, useState } from 'react';
import { Product } from '@/types/index';

export default function useProductDetails(productId: number) {
    // State to store the product details
    const [product, setProduct] = useState<Product | null>(null);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during fetching
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Define an asynchronous function to fetch product details
        async function fetchProduct() {
            // Set loading to true when starting to fetch
            setLoading(true);
            try {
                // Fetch data from the API endpoint using the productId
                const response = await fetch(`http://localhost:8090/api/products/${productId}`);
                // Check if the response is not OK, throw an error if it's not
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                // Parse the JSON data from the response
                const data = await response.json();
                // Update the product state with the fetched data
                setProduct(data);
            } catch (err: any) {
                // Log and set error state if an error occurs during fetching
                console.error('Error:', err);
                setError(err);
            } finally {
                // Set loading to false after fetching is complete, whether successful or not
                setLoading(false);
            }
        }

        // Call the fetchProduct function
        fetchProduct();
    }, [productId]); // Dependency array includes productId to refetch if it changes

    // Return the product details, loading status, and any error
    return { product, loading, error };
}
