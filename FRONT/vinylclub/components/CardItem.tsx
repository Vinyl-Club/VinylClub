import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
            <FontAwesome name="heart-o" size={24} color="black" style={styles.icon} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push({ pathname: "/Details/[id]", params: { id: String(product.id) } })}
            >
                <Text style={styles.buttonText}>Voir le détail</Text>
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
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 7,
        elevation: 4,
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'space-between',
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
        backgroundColor: colors.green,
        paddingVertical: 4,
        paddingHorizontal: 10,
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
