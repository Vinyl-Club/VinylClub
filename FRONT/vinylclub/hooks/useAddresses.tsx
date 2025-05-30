// Import necessary hooks from React
import { useCallback, useEffect, useState } from 'react';
// Import the Address type from local types
import { Address } from '../types/index';

export function useAddresses() {
    // State to store the list of addresses
    const [addresses, setAddresses] = useState<Address[]>([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during fetching
    const [error, setError] = useState<Error | null>(null);

    // Define a function to fetch addresses from the API
    const fetchAddresses = useCallback(async () => {
        // Set loading to true when starting to fetch
        setLoading(true);
        try {
            // Fetch data from the API endpoint
            const response = await fetch('http://localhost:8090/api/addresses', {
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
            // Update the addresses state with the fetched data
            setAddresses(Array.isArray(data) ? data : data.content);
        } catch (err: any) {
            // Set error state if an error occurs during fetching
            setError(err);
            console.error('Error loading addresses:', err);
        } finally {
            // Set loading to false after fetching is complete, whether successful or not
            setLoading(false);
        }
    }, []);

    // Use the useEffect hook to fetch addresses when the component mounts
    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // Return the addresses, loading status, and any error
    return { addresses, loading, error };
}
