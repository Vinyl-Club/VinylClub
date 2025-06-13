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
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { Product } from '@/types/index';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';
import { API_URL } from '@/constants/config';

interface CardHomeProps {
  searchQuery: string;
  categoryId: number | null;       // ← on ajoute ce prop
}

export default function CardHome({ searchQuery, categoryId }: CardHomeProps) {
  const router = useRouter();
  const { products, loading } = useProducts();
  const { addresses }       = useAddresses();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter(product => {
      // 1) filtre par catégorie si categoryId non null
      const matchesCategory = categoryId === null
        ? true
        : product.category?.id === categoryId;

      if (!matchesCategory) return false;

      // 2) filtre par recherche
      if (!query) return true;
      const artist = product.artist?.name.toLowerCase() || '';
      const title  = product.title.toLowerCase();
      return artist.includes(query) || title.includes(query);
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products, categoryId]);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  if (filteredProducts.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun résultat trouvé.</Text>;
  }

  const getFirstImageUrl = (product: Product) => {
    if (product.images?.length) {
      return `${API_URL}${product.images[0].imageUrl}`;
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {filteredProducts.map((product) => {
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
                <FontAwesome name="heart-o" size={24} color="black" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
