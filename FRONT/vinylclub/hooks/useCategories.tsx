// hooks/useCategories.ts
import { useEffect, useState } from 'react';
import { Categories } from '../types/index';

// Custom hook to fetch categories
// Simulates an API call to fetch categories
export function useCategories() {
    // State to store the list of categories
    const [categories, setCategories] = useState<Categories[]>([]);
    // State to manage the loading status
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Async function to simulate an API call
        const fetchCategories = async () => {
            setLoading(true); // Start loading
            try {
                // Replace this with your actual API gateway call
                // Simulated data for example purposes
                const data = [
                    { id: '1', name: 'Rock' },
                    { id: '2', name: 'Jazz' },
                    { id: '3', name: 'Hip-Hop' },
                    { id: '4', name: 'Jazz' },
                    { id: '5', name: 'World' },
                    { id: '6', name: 'Classique' },
                    { id: '7', name: 'Rap' },
                    { id: '8', name: 'Soul' },
                ];
                setCategories(data); // Update state with fetched data
            } catch (e) {
                console.error('Error loading categories:', e); // Handle potential errors
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchCategories(); // Call the function to fetch categories
    }, []); // Empty array means this effect runs once after the component mounts

    return { categories, loading }; // Return categories and loading status
}
