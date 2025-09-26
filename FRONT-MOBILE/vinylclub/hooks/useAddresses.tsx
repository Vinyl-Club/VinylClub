import { useCallback, useEffect, useState } from 'react';
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAddresses(Array.isArray(data) ? data : data.content);
        } catch (err: any) {
            setError(err);
            console.error('Error loading addresses:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Define a function to update an address
    const updateAddress = useCallback(async (address: Address) => {
        try {
            const response = await fetch(`http://localhost:8090/api/addresses/${address.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(address),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the list of addresses after updating
            const data = await response.json(); // ✅ récupère les données
            await fetchAddresses();
            return data; // ✅ retourne la nouvelle adresse
        } catch (err: any) {
            setError(err);
            console.error('Error updating address:', err);
        }
    }, [fetchAddresses]);

    // Define a function to add a new address
    const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
        try {
            const response = await fetch('http://localhost:8090/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(address),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // ✅ récupère les données
            await fetchAddresses();
            return data; // ✅ retourne la nouvelle adresse
        } catch (err: any) {
            setError(err);
            console.error('Error adding address:', err);
        }
    }, [fetchAddresses]);

    // Use the useEffect hook to fetch addresses when the component mounts
    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    // Return the addresses, loading status, error, and functions to update and add addresses
    return { addresses, loading, error, updateAddress, addAddress };
}
