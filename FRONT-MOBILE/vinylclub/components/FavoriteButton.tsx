// components/FavoriteButton.tsx
import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  productId: number;
  variant?: 'icon' | 'button'; // Display as icon only or button with text
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const FavoriteButton = ({ 
  productId, 
  variant = 'icon', 
  size = 'medium',
  style 
}: FavoriteButtonProps) => {
  // Custom hook to manage favorite state and loading
  const { isFavorite, loading, toggleFavorite, isReady } = useFavorites(productId);

  // Icon and padding sizes for each variant
  const sizes = {
    small: { icon: 16, padding: 4 },
    medium: { icon: 24, padding: 8 },
    large: { icon: 28, padding: 12 }
  };

  const currentSize = sizes[size];

  if (variant === 'icon') {
    // Icon-only button (used in CardHome)
    return (
      <TouchableOpacity
        style={[
          styles.iconButton,
          { padding: currentSize.padding },
          (!isReady || loading) && styles.disabled,
          style
        ]}
        onPress={toggleFavorite}
        disabled={loading || !isReady}
      >
        {loading ? (
          <ActivityIndicator size="small" color="gray" />
        ) : (
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={currentSize.icon} 
            color={isFavorite ? "red" : (isReady ? "black" : "gray")} 
          />
        )}
      </TouchableOpacity>
    );
  }

  // Button with icon and text (used in DetailsCard)
  return (
    <TouchableOpacity 
      style={[
        styles.fullButton,
        isFavorite && styles.activeButton,
        (!isReady || loading) && styles.disabled,
        style
      ]} 
      onPress={toggleFavorite}
      disabled={loading || !isReady}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={20} 
            color="white" 
          />
        )}
        <Text style={styles.buttonText}>
          {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'stretch',
  },
  activeButton: {
    backgroundColor: '#EF4444',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});