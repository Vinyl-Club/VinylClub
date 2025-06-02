import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';
import useProductDetails from '@/hooks/useProductDetails';
import { useAddressesByUser } from '@/hooks/useAddressesByUser';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsCard() {
  const { id } = useLocalSearchParams();
  const productId = parseInt(id as string, 10);

  const { product, loading } = useProductDetails(productId);
  const userId = product?.userId ?? null;
  const { address } = useAddressesByUser(userId);

  if (loading || !product) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  return (
    <View>
      {/* Titre */}
      <Text style={styles.title}>{product.title}</Text>

      {/* Image principale */}
      <Image source={require('@/assets/images/demo.png')} style={styles.mainImage} />

      {/* Miniatures */}
      <View style={styles.thumbnailRow}>
        <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
        <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
      </View>

      {/* Vendeur et Localisation */}
      <View style={styles.infoRow}>
        <Text>{product.user?.firstName} {product.user?.lastName}</Text>
        <Text>{address?.city}</Text>
      </View>

      {/* Date de création */}
      <Text>Posté le : {new Date(product.createdAt).toLocaleDateString()}</Text>

      {/* Prix et description */}
      <View style={styles.infoDescription}>
        <Text style={styles.price}>{product.price} €</Text>
        <Text style={styles.label}>{product.description}</Text>
      </View>

      {/* Détails supplémentaires */}
      <Text>{product.album.name} \ {product.artist.name}</Text>
      <Text>{product.state}</Text>
      <Text>{product.releaseYear}</Text>
      <Text>{product.category.name}</Text>

      {/* Bouton favoris */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ajouter aux favoris</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.brownText,
    textAlign: 'center',
    marginVertical: 16,
  },
  mainImage: {
    width: '80%',
    height: 160,
    borderRadius: 8,
    resizeMode: 'cover',
    marginLeft: 30,
  },
  thumbnailRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 8,
    paddingHorizontal: 30,
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
    paddingHorizontal: 30,
  },
  infoDescription: {
    marginVertical: 8,
    paddingHorizontal: 30,
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
