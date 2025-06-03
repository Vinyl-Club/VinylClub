import React, { useState, useEffect } from 'react';
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
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import colors from '@/constants/colors';

export default function AddListingPage() {
  const [artistName, setArtistName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [title, setTitle] = useState(''); // ✅ Ajout du titre du produit
  const [releaseYear, setReleaseYear] = useState(''); // ✅ Ajout année de sortie
  const [categoryId, setCategoryId] = useState(''); // ✅ ID de catégorie au lieu de style
  const [description, setDescription] = useState('');
  const [state, setState] = useState(''); // ✅ État avec valeurs enum
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  // ✅ Listes à récupérer depuis l'API
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  // ✅ États avec valeurs enum backend
  const productStates = [
    { label: 'Neuf', value: 'NEUF' },
    { label: 'Très bon état', value: 'TRES_BON_ETAT' },
    { label: 'Bon état', value: 'BON_ETAT' },
    { label: 'État correct', value: 'ETAT_CORRECT' },
    { label: 'Mauvais état', value: 'MAUVAIS_ETAT' },
  ];

  // ✅ Charger les données depuis l'API
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

  const handleAddImages = () => {
    // TODO: Implémenter la sélection d'images
    Alert.alert('Fonctionnalité à venir', 'Sélection d\'images en développement');
  };

  const handleValidate = async () => {
    // ✅ Validation adaptée aux champs requis
    if (!title || !description || !price || !quantity || !releaseYear || !categoryId || !state) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // ✅ Construction du payload selon votre format
    const productData = {
      title: title,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      releaseYear: parseInt(releaseYear),
      userId: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      artist: artistName ? { id: parseInt(artistName) } : null, // Optionnel
      category: { id: parseInt(categoryId) },
      album: albumName ? { id: parseInt(albumName) } : null, // Optionnel
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

        {/* Nom de l'artiste (optionnel) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Artiste</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={artistName}
              onValueChange={setArtistName}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner un artiste (optionnel)" value="" />
              {artists.map((artist) => (
                <Picker.Item key={artist.id} label={artist.name} value={artist.id.toString()} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Nom de l'album (optionnel) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Album</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={albumName}
              onValueChange={setAlbumName}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner un album (optionnel)" value="" />
              {albums.map((album) => (
                <Picker.Item key={album.id} label={album.name} value={album.id.toString()} />
              ))}
            </Picker>
          </View>
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
    backgroundColor: '#F5E6D3', // Couleur beige/crème comme dans l'image
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513', // Couleur marron
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
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
    backgroundColor: '#F0F0F0', // ✅ Changez cette couleur (gris clair par exemple)
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerStateContainer: {
    backgroundColor: '#F0F0F0', // ✅ Changez cette couleur (gris clair par exemple)
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width : 150,
  },
  picker: {
    height: 50,
    backgroundColor: 'transparent', // ✅ Garde transparent pour hériter du container
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
    width: 150, // Ajustez la largeur selon vos besoins
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
    backgroundColor: colors.green, // Couleur verte comme dans l'image
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'flex-end', // ✅ Alignement à droite au lieu de 'center'
    marginTop: 30,
    marginRight: 20, // ✅ Ajout d'une marge à droite pour l'espacement
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});