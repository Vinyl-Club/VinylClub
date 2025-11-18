// app/(tabs)/favorite.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import React, { useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { useAddresses } from '@/hooks/useAddresses';
import { FavoriteButton } from '@/components/FavoriteButton';
import { API_URL } from '@/constants/config';

// Main screen for favorites
export default function FavoriteScreen() {
  const router = useRouter();
  // Gets the user's favorites and associated functions
  const { favorites, loading, error, refetch, removeFavoriteFromList, user } = useUserFavorites();
  // Gets the addresses of users
  const { addresses } = useAddresses();

  // Reloads favorites every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('FavoriteScreen - Screen refocused, reloading favorites');
      refetch();
    }, [refetch])
  );

  // Callback to handle removing a favorite locally
  const handleFavoriteRemoved = useCallback((productId: number) => {
    console.log('FavoriteScreen - Favorite removed:', productId);
    removeFavoriteFromList(productId);
  }, [removeFavoriteFromList]);

  // Gets the URL of the product's first image
  const getFirstImageUrl = (product: any) => {
    if (product.images?.length) {
      return `${API_URL}${product.images[0].imageUrl}`;
    }
    return null;
  };

  // Debug: Log important data to the console
  console.log('FavoriteScreen Debug:', {
    user,
    favorites,
    loading,
    error,
    favoritesLength: favorites?.length,
    favoritesType: typeof favorites,
    firstFavorite: favorites?.[0]
  });

  // Function to display content based on loading, error, etc.
  const renderContent = () => {
    // Show a loading indicator if needed
    if (loading && favorites.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      );
    }

    // Show an error message if needed
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Prompt the user to log in if not authenticated
    if (!user) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Log in to see your favorites</Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Show a message if the favorites list is empty
    if (!favorites || favorites.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Vous n&apos;avez pas de favoris</Text>
            <Text style={styles.emptySubText}>
            Parcourez nos vinyles et ajoutez vos favoris !
            </Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>Parcourir les Vinyls</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Display the list of favorites
    return (
      <>
        {favorites.map((product, index) => {
          // Check that the product exists
          if (!product) {
            console.warn(`FavoriteScreen - Product undefined at index ${index}`);
            return null;
          }

          console.log('FavoriteScreen - Rendering product:', product);

          // Find the address associated with the product's user
          const address = addresses.find(a => a.user.id === product.userId);
          return (
            <View key={product.id || index} style={styles.card}>
              <Image
                source={{
                  uri: getFirstImageUrl(product) ?? 'https://via.placeholder.com/80x80?text=Vinyl',
                }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <View style={styles.mainInfo}>
                  <Text style={styles.productTitle}>{product.title || 'Unknown title'}</Text>
                  <View style={styles.artistPriceRow}>
                    <Text style={styles.subText}>{product.artist?.name || 'Unknown artist'}</Text>
                    <Text style={styles.price}>{product.price || '0'} €</Text>
                  </View>
                  <Text style={styles.subText}>{product.category?.name || 'Unknown category'}</Text>
                  <Text style={styles.subText}>
                    {address?.city ?? 'Unknown address'}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  {/* Favorite button (removes product from favorites) */}
                  {product.id && (
                    <FavoriteButton 
                      productId={product.id} 
                      variant="icon" 
                      size="medium"
                      style={styles.favoriteButton}
                    />
                  )}
                  {/* Button to go to product details */}
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      router.push({
                        pathname: '/Details/[id]',
                        params: { id: String(product.id || 0) },
                      })
                    }
                  >
                    <Text style={styles.detailButtonText}>See details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  // Main render of the screen
  return (
    <View style={styles.container1}>
      <Headernosearch />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <Text style={styles.sectionTitle}>
          Your Favorites {favorites.length > 0 ? `(${favorites.length})` : ''}
        </Text>
        
        {renderContent()}
      </ScrollView>
    </View>
  );
}

// Styles for the screen and components
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: colors.brownText,
  },
  // Styles for favorite cards
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  mainInfo: {
    flex: 1,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  artistPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  favoriteButton: {
    marginRight: 12,
  },
  detailButton: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  // Styles for empty/error/loading states
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: colors.brownText,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  browseButton: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});