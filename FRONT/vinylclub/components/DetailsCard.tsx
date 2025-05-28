
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';
import useProductDetails from '@/hooks/useProductDetails';
import { useLocalSearchParams } from 'expo-router';


export default function DetailsCard() {
  const { id } = useLocalSearchParams(); // récupère l'id depuis l'URL / navigation
  console.log(id); // pour vérifier que l'id est correct
  const productId = parseInt(id as string, 10);
  console.log(productId); // pour vérifier que l'id est correct
  const { product, loading } = useProductDetails(productId);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

    return (
        <View>
        <Text style={styles.title}>{product.title}</Text>
        
        {/* Image principale */}
        <Image source={require('@/assets/images/demo.png')} style={styles.mainImage} />
        
        {/* Miniatures */}
        <View style={styles.thumbnailRow}>
            <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
            <Image source={require('@/assets/images/demo.png')} style={styles.thumbnail} />
        </View>

        {/* Infos */}
        <View style={styles.infoRow}>
            <Text>Nom du vendeur</Text>
            <Text>Localisation</Text>
        </View>

        <Text>Posté le : {new Date(product.createdAt).toLocaleDateString()}</Text>
        
        <View style={styles.infoDescription}>
          <Text style={styles.label}>{product.description}</Text>
          <Text style={styles.price}>{product.price}</Text>
        </View>

        <Text>{product.album.name} \ {product.artist.name}</Text>
        <Text>{product.state}</Text>
        <Text>{product.releaseYear}</Text>
        <Text>{product.category.name}</Text>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 8,
  },
  label: {
    marginTop: 12,
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
