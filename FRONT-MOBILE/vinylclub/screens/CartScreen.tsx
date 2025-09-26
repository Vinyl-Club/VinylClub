// app/(tabs)/cart.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import colors from '@/constants/colors';
import { API_URL } from '@/constants/config';
import { Product, User } from '@/types/index';
import { useAddressesByUser } from '@/hooks/useAddressesByUser';

export default function ContactScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [seller, setSeller]   = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch product and seller info on mount
    useEffect(() => {
        if (!id) return;
        (async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`);
            if (!res.ok) throw new Error(`Produit ${id} introuvable`);
            const data: Product = await res.json();
            setProduct(data);

            // Fetch seller info after product is loaded
            const userRes = await fetch(`${API_URL}/api/users/${data.userId}`);
            if (!userRes.ok) throw new Error('Vendeur introuvable');
            const userData: User = await userRes.json();
            setSeller(userData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        })();
    }, [id]);

    // Fetch seller address using custom hook
    const userId = product?.userId ?? null;
    const { address, loading: addrLoading } = useAddressesByUser(userId);

    if (loading) {
        // Show loading indicator while fetching data
        return (
        <ActivityIndicator
            style={{ flex: 1 }}
            size="large"
            color={colors.green}
        />
        );
    }

    if (!product) {
        // Show error if product not found
        return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Produit introuvable</Text>
        </View>
        );
    }

    // Get product image or fallback to placeholder
    const imageUrl = product.images?.[0]?.imageUrl
        ? `${API_URL}${product.images[0].imageUrl}`
        : 'https://via.placeholder.com/80x80?text=Vinyl';

    // Get seller email or fallback
    const sellerEmail = seller?.email ?? 'Email indisponible';

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Contacter le vendeur</Text>

        <View style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />

            <View style={styles.info}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.text}>{product.artist.name}</Text>
            <Text style={styles.text}>{product.category.name}</Text>
            <Text style={styles.text}>
                {addrLoading
                ? 'Chargement de la localisation...'
                : address?.city ?? 'Localisation inconnue'}
            </Text>
            </View>

            <Text style={styles.price}>{product.price} €</Text>
        </View>

        <View style={styles.footer}>
            <Text style={styles.contactText}>
            Vous pouvez contacter le vendeur à cette adresse :
            </Text>
            <Text style={styles.email}>{sellerEmail}</Text>
        </View>
        </ScrollView>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.brownText,
        textAlign: 'center',
        marginBottom: 50,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 50,
        boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
        height : 170,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    info: { flex: 1 },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    price: {
        fontWeight: 'bold',
        color: colors.brownText,
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    contactText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.brownText,
    },
});
