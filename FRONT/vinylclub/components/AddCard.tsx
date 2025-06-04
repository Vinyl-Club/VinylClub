import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Autocomplete from 'react-native-autocomplete-input';
import colors from '@/constants/colors';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

interface Category {
  id: number;
  name: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Album {
  id: number;
  name: string;
}

export default function AddListingPage() {
  const [artistName, setArtistName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [state, setState] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  // États pour l'auto-complétion
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  const productStates = [
    { label: 'Très bon état', value: 'TRES_BON_ETAT' },
    { label: 'Bon état', value: 'BON_ETAT' },
    { label: 'Mauvais état', value: 'MAUVAIS_ETAT' },
  ];

  useEffect(() => {
    fetchCategories();
    fetchArtists();
    fetchAlbums();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/artists');
      const data = await response.json();
      setArtists(data);
      console.log('Artistes chargés:', data); // Debug
    } catch (error) {
      console.error('Erreur lors du chargement des artistes:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Erreur lors du chargement des albums:', error);
    }
  };

  // Fonction pour filtrer les artistes
  const handleArtistTextChange = (text: string) => {
    setArtistName(text);
    setSelectedArtistId(null); // Reset de la sélection
    
    if (text.length > 0) {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredArtists(filtered);
      console.log('Artistes filtrés:', filtered); // Debug
    } else {
      setFilteredArtists([]);
    }
  };

  // Fonction pour sélectionner un artiste
  const handleArtistSelect = (artist: Artist) => {
    setArtistName(artist.name);
    setSelectedArtistId(artist.id);
    setFilteredArtists([]);
  };

  // Fonction pour filtrer les albums
  const handleAlbumTextChange = (text: string) => {
    setAlbumName(text);
    setSelectedAlbumId(null); // Reset de la sélection
    
    if (text.length > 0) {
      const filtered = albums.filter(album =>
        album.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums([]);
    }
  };

  // Fonction pour sélectionner un album
  const handleAlbumSelect = (album: Album) => {
    setAlbumName(album.name);
    setSelectedAlbumId(album.id);
    setFilteredAlbums([]);
  };

  const handleAddImages = () => {
    Alert.alert('Fonctionnalité à venir', 'Sélection d\'images en développement');
  };

  const handleValidate = async () => {
    if (!title || !description || !price || !quantity || !releaseYear || !categoryId || !state) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const productData = {
      title: title,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      releaseYear: parseInt(releaseYear),
      userId: 1,
      artist: selectedArtistId ? { id: selectedArtistId } : null,
      category: { id: parseInt(categoryId) },
      album: selectedAlbumId ? { id: selectedAlbumId } : null,
      status: "AVAILABLE",
      state: state
    };

    try {
      const response = await fetch('http://localhost:8090/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Annonce ajoutée avec succès !');
        // Reset du formulaire
        setTitle('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setReleaseYear('');
        setCategoryId('');
        setState('');
        setArtistName('');
        setAlbumName('');
        setSelectedArtistId(null);
        setSelectedAlbumId(null);
        setFilteredArtists([]);
        setFilteredAlbums([]);
      } else {
        const errorData = await response.json();
        Alert.alert('Erreur', `Erreur lors de l'ajout: ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ajouter une annonce</Text>

        {/* Titre du produit */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre du produit *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Abbey Road - Vinyl LP"
          />
        </View>

        {/* Auto-complétion Artiste */}
        <View style={[styles.inputGroup, styles.autocompleteGroup, { zIndex: 3 }]}>
          <Text style={styles.label}>Artiste</Text>
          <Autocomplete
            data={filteredArtists}
            value={artistName}
            onChangeText={handleArtistTextChange}
            placeholder="Tapez le nom de l'artiste..."
            inputContainerStyle={styles.autocompleteInputContainer}
            containerStyle={styles.autocompleteWrapper}
            listContainerStyle={styles.autocompleteListContainer}
            flatListProps={{
              style: styles.autocompleteList,
              keyboardShouldPersistTaps: 'always',
              nestedScrollEnabled: true,
              renderItem: ({ item, index }: { item: Artist; index: number }) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.autocompleteItem}
                  onPress={() => handleArtistSelect(item)}
                >
                  <Text style={styles.autocompleteItemText}>{item.name}</Text>
                </TouchableOpacity>
              ),
              keyExtractor: (item: Artist) => item.id.toString()
            }}
            hideResults={filteredArtists.length === 0}
          />
        </View>

        {/* Auto-complétion Album */}
        <View style={[styles.inputGroup, styles.autocompleteGroup, { zIndex: 2 }]}>
          <Text style={styles.label}>Album</Text>
          <Autocomplete
            data={filteredAlbums}
            value={albumName}
            onChangeText={handleAlbumTextChange}
            placeholder="Tapez le nom de l'album..."
            inputContainerStyle={styles.autocompleteInputContainer}
            containerStyle={styles.autocompleteWrapper}
            listContainerStyle={styles.autocompleteListContainer}
            hideResults={filteredAlbums.length === 0}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              nestedScrollEnabled: true,
              renderItem: ({ item, index }: { item: Album; index: number }) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.autocompleteItem}
                  onPress={() => handleAlbumSelect(item)}
                >
                  <Text style={styles.autocompleteItemText}>{item.name}</Text>
                </TouchableOpacity>
              ),
              keyExtractor: (item: Album) => item.id.toString()
            }}
          />
        </View>

        {/* Année de sortie */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Année de sortie *</Text>
          <TextInput
            style={[styles.textInput, styles.yearInput]}
            value={releaseYear}
            onChangeText={setReleaseYear}
            placeholder="1969"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Ajouter des images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ajouter des images</Text>
          <TouchableOpacity style={styles.imageButton} onPress={handleAddImages}>
            <FontAwesome name="camera" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryId}
              onValueChange={setCategoryId}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner une catégorie" value="" />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre vinyl..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* État */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>État *</Text>
          <View style={styles.pickerStateContainer}>
            <Picker
              selectedValue={state}
              onValueChange={setState}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner l'état" value="" />
              {productStates.map((condition, index) => (
                <Picker.Item key={index} label={condition.label} value={condition.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Prix */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prix *</Text>
          <View style={styles.priceContainer}>
            <TextInput
              style={[styles.textInput, styles.priceInput]}
              value={price}
              onChangeText={setPrice}
              placeholder="29.99"
              keyboardType="decimal-pad"
            />
            <Text style={styles.euroSymbol}>€</Text>
          </View>
        </View>

        {/* Quantité */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantité *</Text>
          <TextInput
            style={[styles.textInput, styles.quantityInput]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            keyboardType="numeric"
          />
        </View>

        {/* Bouton Valider */}
        <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
          <Text style={styles.validateButtonText}>Valider</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  // Style spécial pour les groupes avec auto-complétion
  autocompleteGroup: {
    marginBottom: 40, // Réduit de 80 à 40
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 4,
  },
  pickerStateContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: 150,
  },
  picker: {
    height: 50,
    backgroundColor: 'transparent',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
    width: 150,
  },
  euroSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  quantityInput: {
    width: 150,
  },
  yearInput: {
    width: 120,
  },
  validateButton: {
    backgroundColor: colors.green,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'flex-end',
    marginTop: 30,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  validateButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Styles pour l'auto-complétion
  autocompleteWrapper: {
    flex: 1,
  },
  autocompleteInputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
  },
  autocompleteListContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 120,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 48,
    zIndex: 1000,
  },
  autocompleteList: {
    backgroundColor: 'white',
    margin: 0,
    padding: 0,
  },
  autocompleteItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  autocompleteItemText: {
    fontSize: 16,
    color: '#333',
  },
});
