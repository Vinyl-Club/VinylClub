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

    // 1) On fetch le produit
    useEffect(() => {
        if (!id) return;
        (async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`);
            if (!res.ok) throw new Error(`Produit ${id} introuvable`);
            const data: Product = await res.json();
            setProduct(data);

            // 2) Dès qu'on connaît product.userId, on fetch le user
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

    // 3) Hook pour la ville
    const userId = product?.userId ?? null;
    const { address, loading: addrLoading } = useAddressesByUser(userId);

    if (loading) {
        return (
        <ActivityIndicator
            style={{ flex: 1 }}
            size="large"
            color={colors.green}
        />
        );
    }

    if (!product) {
        return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Produit introuvable</Text>
        </View>
        );
    }

    // url image ou placeholder
    const imageUrl = product.images?.[0]?.imageUrl
        ? `${API_URL}${product.images[0].imageUrl}`
        : 'https://via.placeholder.com/80x80?text=Vinyl';

    // email du vendeur, depuis le fetch user
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

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: colors.beige,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.brownText,
        textAlign: 'center',
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 7,
        elevation: 4,
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
        fontWeight: '600',
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.brownText,
        marginLeft: 12,
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
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.green,
    },
});
