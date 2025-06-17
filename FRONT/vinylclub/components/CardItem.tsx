import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { Product } from '@/types/index';
import { API_URL } from '@/constants/config';

type CardItemProps = {
    product: Product;
    city?: string;
};

export default function CardItem({ product, city }: CardItemProps) {
    const router = useRouter();
    const imageUrl =
        product.images && product.images.length > 0
        ? `${API_URL}${product.images[0].imageUrl}`
        : 'https://via.placeholder.com/80x80?text=Vinyl';

    return (
        <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
            <View style={styles.textContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.artistPriceRow}>
                <Text style={styles.subText}>{product.artist.name}</Text>
                <Text style={styles.price}>{product.price} €</Text>
            </View>
            <Text style={styles.subText}>{product.category.name}</Text>
            <Text style={styles.subText}>{city || 'Ville inconnue'}</Text>
            </View>
            <View style={styles.bottomRow}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push({ pathname: "/profile", params: { id: String(product.id) } })}
            >
                <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
        width: '80%',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    textContainer: {
        marginBottom: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
    },
    subText: {
        fontSize: 14,
        color: '#333',
    },
    bottomRow: {
        
        alignItems: 'flex-end',
        gap: 8,
    },
    price: {
        color: colors.brownText,
        fontWeight: 'bold',
        marginEnd: 10,
    },
    icon: {
        marginLeft: 'auto',
        marginRight: 10,
    },
    button: {
        backgroundColor: colors.orange,
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderRadius: 10,
    },
    buttonText: {
        color: 'black',
        fontWeight: '500',
    },
    artistPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
