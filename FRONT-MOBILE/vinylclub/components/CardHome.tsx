// components/CardHome.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { Product } from '@/types/index';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';
import { FavoriteButton } from '@/components/FavoriteButton';
import { API_URL } from '@/constants/config';

interface CardHomeProps {
  searchQuery: string;
  categoryId: number | null;
}

export default function CardHome({ searchQuery, categoryId }: CardHomeProps) {
  const router = useRouter();
  const { products, loading } = useProducts();
  const { addresses } = useAddresses();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter products by search query and category
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter(product => {
      // Filter by category if categoryId is provided
      const matchesCategory = categoryId === null
        ? true
        : product.category?.id === categoryId;

      if (!matchesCategory) return false;

      // Filter by search query (artist or title)
      if (!query) return true;
      const artist = product.artist?.name.toLowerCase() || '';
      const title = product.title.toLowerCase();
      return artist.includes(query) || title.includes(query);
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products, categoryId]);

  // Show loading indicator while fetching products
  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  // Show message if no products match the filters
  if (filteredProducts.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun résultat trouvé.</Text>;
  }

  // Get first image URL for a product, or fallback to placeholder
  const getFirstImageUrl = (product: Product) => {
    if (product.images?.length) {
      return `${API_URL}${product.images[0].imageUrl}`;
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {filteredProducts.map((product) => {
        // Find address for the product's user
        const address = addresses.find(a => a.user.id === product.userId);
        return (
          <View key={product.id} style={styles.card}>
            <Image
              source={{
                uri: getFirstImageUrl(product)
                  ?? 'https://via.placeholder.com/80x80?text=Vinyl',
              }}
              style={styles.image}
            />
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.title}>{product.title}</Text>
                <View style={styles.artistPriceRow}>
                  <Text style={styles.subText}>{product.artist.name}</Text>
                  <Text style={styles.price}>{product.price} €</Text>
                </View>
                <Text style={styles.subText}>{product.category.name}</Text>
                <Text style={styles.subText}>
                  {address?.city ?? 'Adresse inconnue'}
                </Text>
              </View>
              <View style={styles.bottomRow}>
                {/* Favorite button for the product */}
                <FavoriteButton 
                  productId={product.id} 
                  variant="icon" 
                  size="medium"
                  style={styles.favoriteButton}
                />
                {/* Navigate to product details */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: '/Details/[id]',
                      params: { id: String(product.id) },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Voir le détail</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// Styles for the card and its elements
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
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
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#333',
  },
  artistPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  favoriteButton: {
    marginRight: 12,
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
});