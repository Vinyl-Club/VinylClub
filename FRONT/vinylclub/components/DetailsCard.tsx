// Import necessary components and hooks from React Native and local files
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';
import useProductDetails from '@/hooks/useProductDetails';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsCard() {
  // Extract the ID from the URL or navigation parameters
  const { id } = useLocalSearchParams();
  console.log(id); // Log the ID to verify it is correct

  // Convert the ID to an integer
  const productId = parseInt(id as string, 10);

  // Use the custom hook to fetch product details and handle loading state
  const { product, loading } = useProductDetails(productId);

  // Display a loading indicator while the data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  return (
    <View>
      {/* Display the product title */}
      <Text style={styles.title}>{product.title}</Text>

      {/* Main product image */}
      <Image source={require('@/assets/images/demo.png')} style={styles.mainImage} />

      {/* Thumbnail images */}
      <View style={styles.thumbnailRow}>
        <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
        <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
      </View>

      {/* Seller information */}
      <View style={styles.infoRow}>
        <Text>Nom du vendeur</Text>
        <Text>Localisation</Text>
      </View>

      {/* Display the product creation date */}
      <Text>Posté le : {new Date(product.createdAt).toLocaleDateString()}</Text>

      {/* Product price and description */}
      <View style={styles.infoDescription}>
        <Text style={styles.price}>{product.price} €</Text>
        <Text style={styles.label}>{product.description}</Text>
      </View>

      {/* Additional product details */}
      <Text>{product.album.name} \ {product.artist.name}</Text>
      <Text>{product.state}</Text>
      <Text>{product.releaseYear}</Text>
      <Text>{product.category.name}</Text>

      {/* Button to add the product to favorites */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ajouter aux favoris</Text>
      </TouchableOpacity>
    </View>
  );
}

// Define styles for the component using StyleSheet
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.brownText,
    textAlign: 'center',
    marginVertical: 16,
  },
  mainImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  thumbnailRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  infoDescription: {
    marginVertical: 8,
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 8,
  },
  label: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
