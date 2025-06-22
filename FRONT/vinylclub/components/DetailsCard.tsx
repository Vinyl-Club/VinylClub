import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import colors from '@/constants/colors';
import useProductDetails from '@/hooks/useProductDetails';
import { useAddressesByUser } from '@/hooks/useAddressesByUser';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

  if (loading || !product) {
    return <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 20 }} />;
  }

  const HandleContact = () => {
    router.push ({ pathname: '/(tabs)/cart', params: { id: String(product.id) } });
  };
  
  return (
    <View>
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
      
      {/* Bouton favoris */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ajouter aux favoris</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={HandleContact}>
        <Text style={styles.buttonText}>Contacter le vendeur</Text>
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
    // justifyContent: 'space-between',
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
  button: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  }
});