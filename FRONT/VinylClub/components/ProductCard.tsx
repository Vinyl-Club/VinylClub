import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Vinyl } from '@/types';
import { router } from 'expo-router';

interface ProductCardProps {
  vinyl: Vinyl;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colonnes avec margin

export default function ProductCard({ vinyl }: ProductCardProps) {
  const handlePress = () => {
    router.push(`/api/product/${vinyl.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: vinyl.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        {!vinyl.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Épuisé</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.artist} numberOfLines={1}>
          {vinyl.artist}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {vinyl.title}
        </Text>
        <Text style={styles.genre}>{vinyl.genre}</Text>
        
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{vinyl.price}€</Text>
          <Text style={styles.condition}>{vinyl.condition}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: cardWidth,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
  },
  artist: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  genre: {
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  condition: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});