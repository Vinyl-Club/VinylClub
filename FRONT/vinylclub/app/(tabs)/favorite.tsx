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

export default function FavoriteScreen() {
  const router = useRouter();
  const { favorites, loading, error, refetch, removeFavoriteFromList, user } = useUserFavorites();
  const { addresses } = useAddresses();

  // Recharger les favoris quand l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      console.log('FavoriteScreen - Écran refocusé, rechargement des favoris');
      refetch();
    }, [refetch])
  );

  // Callback pour gérer la suppression d'un favori
  const handleFavoriteRemoved = useCallback((productId: number) => {
    console.log('FavoriteScreen - Favori supprimé:', productId);
    removeFavoriteFromList(productId);
  }, [removeFavoriteFromList]);

  const getFirstImageUrl = (product: any) => {
    if (product.images?.length) {
      return `${API_URL}${product.images[0].imageUrl}`;
    }
    return null;
  };

  // Debug: Affichons les données pour comprendre le problème
  console.log('FavoriteScreen Debug:', {
    user,
    favorites,
    loading,
    error,
    favoritesLength: favorites?.length,
    favoritesType: typeof favorites,
    firstFavorite: favorites?.[0]
  });

  // Fonction pour rendre le contenu selon l'état
  const renderContent = () => {
    // Chargement initial
    if (loading && favorites.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
        </View>
      );
    }

    // Gestion d'erreur
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Utilisateur non connecté
    if (!user) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Connectez-vous pour voir vos favoris</Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Liste vide
    if (!favorites || favorites.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
          <Text style={styles.emptySubText}>
            Parcourez nos vinyles et ajoutez vos coups de cœur !
          </Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>Parcourir les vinyles</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Liste des favoris avec vérifications de sécurité
    return (
      <>
        {favorites.map((product, index) => {
          // Vérification de sécurité pour éviter l'erreur
          if (!product) {
            console.warn(`FavoriteScreen - Produit undefined à l'index ${index}`);
            return null;
          }

          console.log('FavoriteScreen - Rendu produit:', product);

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
                  <Text style={styles.productTitle}>{product.title || 'Titre inconnu'}</Text>
                  <View style={styles.artistPriceRow}>
                    <Text style={styles.subText}>{product.artist?.name || 'Artiste inconnu'}</Text>
                    <Text style={styles.price}>{product.price || '0'} €</Text>
                  </View>
                  <Text style={styles.subText}>{product.category?.name || 'Catégorie inconnue'}</Text>
                  <Text style={styles.subText}>
                    {address?.city ?? 'Adresse inconnue'}
                  </Text>
                </View>
                <View style={styles.bottomRow}>
                  {/* Bouton favori avec callback de suppression */}
                  {product.id && (
                    <FavoriteButton 
                      productId={product.id} 
                      variant="icon" 
                      size="medium"
                      style={styles.favoriteButton}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      router.push({
                        pathname: '/Details/[id]',
                        params: { id: String(product.id || 0) },
                      })
                    }
                  >
                    <Text style={styles.detailButtonText}>Voir le détail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Headernosearch />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <Text style={styles.sectionTitle}>
          Vos Favoris {favorites.length > 0 ? `(${favorites.length})` : ''}
        </Text>
        
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: colors.brownText,
  },
  // Styles pour les cartes de favoris
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
  // Styles pour les états vides/erreur/chargement
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