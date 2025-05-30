// Import necessary components and hooks from React Native and local files
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Product } from '@/types/index';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';

export default function CardHome() {
  // Initialize the router for navigation
  const router = useRouter();
  // Fetch products and loading state using the custom hook
  const { products, loading } = useProducts();
  // Fetch addresses using the custom hook
  const { addresses } = useAddresses();

  // Display a loading indicator while the data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  return (
    // Use ScrollView to enable scrolling through the list of products
    <ScrollView>
      {products.map((product: Product, index: number) => {
        // Find the address associated with the product's user ID
        const address = addresses.find(a => a.user.id === product.userId);

        return (
          // Card container for each product
          <View key={product.id || index} style={styles.card}>
            {/* Product image */}
            <Image source={require('@/assets/images/demo.png')} style={styles.image} />

            {/* Container for product information */}
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                {/* Product title */}
                <Text style={styles.title}>{product.title}</Text>
                {/* Row for artist name and product price */}
                <View style={styles.artistPriceRow}>
                  <Text style={styles.subText}>{product.artist.name}</Text>
                  <Text style={styles.price}>{product.price} €</Text>
                </View>
                {/* Product category */}
                <Text style={styles.subText}>{product.category.name}</Text>
                {/* Product address or unknown if not available */}
                <Text style={styles.subText}>
                  {address ? `${address.city}` : 'Adresse inconnue'}
                </Text>
              </View>

              {/* Bottom row with favorite icon and detail button */}
              <View style={styles.bottomRow}>
                <FontAwesome name="heart-o" size={24} color="black" style={styles.icon} />
                {/* Button to navigate to the product detail page */}
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
      })}
    </ScrollView>
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
