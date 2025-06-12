import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import CardItem from '@/components/CardItem';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
    const { products } = useProducts();
    const { addresses, addAddress, updateAddress } = useAddresses();
    const { fetchCurrentUser, getTokens } = useAuth();
    const router = useRouter();

    const [loadedUser, setLoadedUser] = useState<any>(null);
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    // 🔁 Charger l'utilisateur une seule fois
    useEffect(() => {
        const loadUser = async () => {
            try {
                const { accessToken } = await getTokens();
                
                if (accessToken) {
                    const freshUser = await fetchCurrentUser(accessToken);
                    if (freshUser) setLoadedUser(freshUser);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur :", error);
            }
        };
        loadUser();
    }, []);

    const isInitialized = useRef(false);

    useEffect(() => {
        if (loadedUser && addresses.length > 0 && !isInitialized.current) {
            setFirstName(loadedUser.firstName || '');
            setLastName(loadedUser.lastName || '');
            setEmail(loadedUser.email || '');

            const userAddress = addresses.find(a => a.user.id === loadedUser.id);
            if (userAddress) {
            setAddress(userAddress.street || '');
            setZipCode(userAddress.zipCode || '');
            setCity(userAddress.city || '');
            setCountry(userAddress.country || '');
            }

            isInitialized.current = true; // ❗ Ne le refera plus
        }
    }, [loadedUser, addresses]);

    const userProducts = products.filter(p => p.userId === loadedUser?.id);

    const handleSave = async () => {
        try {
        const userAddress = addresses.find(a => a.user.id === loadedUser?.id);

        if (userAddress) {
            await updateAddress({
            id: userAddress.id,
            street: address,
            zipCode,
            city,
            country,
            user: loadedUser,
            });
            alert('Adresse mise à jour avec succès');
        } else {
            await addAddress({
                street: address,
                zipCode,
                city,
                country,
                user: loadedUser ?? {},
            });
            alert('Adresse ajoutée avec succès');
        }
        } catch (err) {
        console.error('Erreur lors de la sauvegarde de l’adresse:', err);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Votre profil</Text>

            {[
            { label: 'Nom', value: lastName, setter: setLastName },
            { label: 'Prénom', value: firstName, setter: setFirstName },
            { label: 'Email', value: email, setter: setEmail, keyboardType: 'email-address' },
            { label: 'Adresse', value: address, setter: setAddress },
            { label: 'Code postal', value: zipCode, setter: setZipCode },
            { label: 'Ville', value: city, setter: setCity },
            { label: 'Pays', value: country, setter: setCountry },
            ].map(({ label, value, setter, keyboardType = 'default' }, index) => (
            <View key={index} style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                style={styles.input}
                placeholder={label}
                value={value}
                onChangeText={setter}
                keyboardType={keyboardType as any}
                />
            </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Vos annonces</Text>
        <View style={styles.annoncesSection}>
            {userProducts.map(product => {
            const productAddress = addresses.find(a => a.user.id === product.userId);
            return (
                <CardItem key={product.id} product={product} city={productAddress?.city} />
            );
            })}
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={[styles.button, styles.supprimerButton]}
            onPress={() => router.push('/login')}
            >
            <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.button, styles.validerButton]}
            onPress={handleSave}
            >
            <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    profileSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: colors.brownText,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 7,
        elevation: 4,
        color: '#666',
    },
    annoncesSection: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    button: {
        padding: 10,
        borderRadius: 20,
        width: '40%',
        alignItems: 'center',
    },
    supprimerButton: {
        backgroundColor: colors.orange,
    },
    validerButton: {
        backgroundColor: colors.green,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
