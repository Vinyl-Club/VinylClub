import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import colors from '@/constants/colors';
import useProductDetails from '@/hooks/useProductDetails';
import { useAddressesByUser } from '@/hooks/useAddressesByUser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FavoriteButton } from '@/components/FavoriteButton';
import { API_URL_IMG } from '@/constants/config';

export default function DetailsCard() {
  const { id } = useLocalSearchParams();
  const productId = parseInt(id as string, 10);
  const { product, loading } = useProductDetails(productId);
  const userId = product?.userId ?? null;
  const { address } = useAddressesByUser(userId);
  console.log('Product:', product);
  console.log('Address:', address);

  const router = useRouter();

  // State pour gérer l'index de l'image principale affichée
  // State to manage the index of the displayed main image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Helper function to get image URL by index
  const getImageUrl = (product: any, index: number): string | null => {
    if (product?.images && product.images.length > index) {
      return `${API_URL_IMG}${product.images[index].id}`;
    }
    return null;
  };

  // Helper function to get main image URL based on selected index
  const getMainImageUrl = (product: any): string => {
    return getImageUrl(product, selectedImageIndex) || 'https://via.placeholder.com/300x160?text=Vinyl';
  };

  // Function to handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleGoBack = () => {
    // Option A: Navigation avec paramètre de rechargement
    router.push('/(tabs)/?reload=true');
    
    // Option B: Ou simplement router.back() si vous utilisez useFocusEffect
    // router.back();
  };

  const HandleContact = () => {
    router.push ({ pathname: '/(tabs)/cart', params: { id: String(product.id) } });
  };

  if (loading || !product) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color={colors.brownText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du vinyle</Text>
        <View style={styles.placeholder} /> {/* Pour centrer le titre */}
      </View>

      {/* Titre */}
      <Text style={styles.title}>{product.title}</Text>
      
      {/* Image principale */}
      <TouchableOpacity onPress={() => handleThumbnailClick(0)}>
        <Image 
          source={{ uri: getMainImageUrl(product) }} 
          style={styles.mainImage}
          onError={() => console.log('Erreur de chargement image principale:', product.id)}
        />
      </TouchableOpacity>
      
      {/* Miniatures */}
      {product.images && product.images.length > 1 && (
        <View style={styles.thumbnailRow}>
          {product.images.map((imageData: any, index: number) => (
            <TouchableOpacity 
              key={index}
              onPress={() => handleThumbnailClick(index)}
              style={[
                styles.thumbnailContainer,
                selectedImageIndex === index && styles.selectedThumbnail
              ]}
            >
              <Image 
                source={{ uri: `${API_URL_IMG}${imageData.id}` }} 
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnailImage
                ]}
                onError={() => console.log('Erreur de chargement miniature:', imageData.id)}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Vendeur et Localisation */}
      <View style={styles.infoRow}>
        <Text>{address?.user?.firstName} {address?.user?.lastName}</Text>
        <Text>{address ? address.city : 'Ville inconnue'}</Text>
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
      
      {/* Section des boutons */}
      <View style={styles.buttonContainer}>
        {/* Bouton favoris réutilisable avec variante "button" */}
        <FavoriteButton 
          productId={productId} 
          variant="button" 
          size="large"
        />

        <TouchableOpacity style={styles.button} onPress={HandleContact}>
          <Text style={styles.buttonText}>Contacter le vendeur</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Pour éviter la status bar
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.brownText,
  },
  placeholder: {
    width: 40, // Même largeur que le bouton retour pour centrer le titre
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.brownText,
    textAlign: 'center',
    marginVertical: 16,
  },
  mainImage: {
    width: '70%',
    height: 180,
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
  thumbnailContainer: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: colors.green,
    boxShadow: `0px 2px 7px ${colors.green}`
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  selectedThumbnailImage: {
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: '20%',
    paddingHorizontal: 10,
  },
  infoDescription: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  label: {
    marginTop: 2,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  }
});