// Import necessary components and hooks from React Native and local files
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Product } from '@/types/index';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';
import { API_URL } from '@/constants/config';


export default function CardHome({ searchQuery }: { searchQuery: string }) {
  // Initialize the router for navigation
  const router = useRouter();
  // Fetch products and loading state using the custom hook
  const { products, loading } = useProducts();
  // Fetch addresses using the custom hook
  const { addresses } = useAddresses();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products); // afficher tous les produits si rien n'est saisi
    } else {
      const filtered = products.filter(product => {
        const query = searchQuery.toLowerCase();
        const artistMatch = product.artist?.name.toLowerCase().includes(query);
        const titleMatch = product.title.toLowerCase().includes(query);
        return artistMatch || titleMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Helper function to get the first image URL
  const getFirstImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      
      return `${API_URL}${product.images[0].imageUrl}`; // Assuming imageUrl is the property containing the URL
    }
    return null; // ou une image par défaut
  };

  // Display a loading indicator while the data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {filteredProducts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun résultat trouvé.</Text>
        ) : (
          filteredProducts.map((product, index) => {
            const address = addresses.find(a => a.user.id === product.userId);

            return (
              <View key={product.id || index} style={styles.card}>
                <Image
                  source={{ uri: getFirstImageUrl(product) || 'https://via.placeholder.com/80x80?text=Vinyl' }}
                  style={styles.image}
                />
                <View style={styles.infoContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{product.title}</Text>
                    <View style={styles.artistPriceRow}>
                      <Text style={styles.subText}>{product.artist.name}</Text>
                      <Text style={styles.price}>{product.price} €</Text>
                    </View>
                    <Text style={styles.subText}>{product.category.name}</Text>
                    <Text style={styles.subText}>{address ? `${address.city}` : 'Adresse inconnue'}</Text>
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
          })
        )}
      </ScrollView>
    </View>
  );
}

// Define styles for the component using StyleSheet
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    color: 'Black',
    fontWeight: '500',
  },
  artistPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});