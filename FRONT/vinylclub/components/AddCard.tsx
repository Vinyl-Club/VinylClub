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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';

interface Category { id: number; name: string }
interface Artist   { id: number; name: string }
interface Album    { id: number; name: string }
interface ArtistPayload { name: string }
interface AlbumPayload  { name: string }

export default function AddListingPage() {
  const { user } = useAuth(); // utilisateur connecté
  const userId = user?.id;

  // --- Form states ---
  const [artistName, setArtistName]           = useState('');
  const [albumName, setAlbumName]             = useState('');
  const [title, setTitle]                     = useState('');
  const [description, setDescription]         = useState('');
  const [releaseYear, setReleaseYear]         = useState('');
  const [categoryId, setCategoryId]           = useState('');
  const [price, setPrice]                     = useState('');
  const [quantity, setQuantity]               = useState('');
  const [state, setState]                     = useState('');

  const [categories, setCategories]           = useState<Category[]>([]);
  const [artists, setArtists]                 = useState<Artist[]>([]);
  const [albums, setAlbums]                   = useState<Album[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [filteredAlbums, setFilteredAlbums]   = useState<Album[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId]   = useState<number | null>(null);

  // Images state
  const [images, setImages]                   = useState<ImagePicker.ImagePickerAsset[]>([]);

  const productStates = [
    { label: 'Très bon état', value: 'TRES_BON_ETAT' },
    { label: 'Bon état',      value: 'BON_ETAT'      },
    { label: 'Mauvais état',  value: 'MAUVAIS_ETAT'  },
  ];

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchArtists();
    fetchAlbums();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8090/api/categories');
      setCategories(await res.json());
    } catch (e) {
      console.error('Erreur loading categories:', e);
    }
  };
  const fetchArtists = async () => {
    try {
      const res = await fetch('http://localhost:8090/api/artists');
      setArtists(await res.json());
    } catch (e) {
      console.error('Erreur loading artists:', e);
    }
  };
  const fetchAlbums = async () => {
    try {
      const res = await fetch('http://localhost:8090/api/albums');
      setAlbums(await res.json());
    } catch (e) {
      console.error('Erreur loading albums:', e);
    }
  };

  // Autocomplete handlers
  const handleArtistTextChange = (text: string) => {
    setArtistName(text);
    setSelectedArtistId(null);
    setFilteredArtists(text
      ? artists.filter(a => a.name.toLowerCase().includes(text.toLowerCase()))
      : []);
  };
  const handleArtistSelect = (artist: Artist) => {
    setArtistName(artist.name);
    setSelectedArtistId(artist.id);
    setFilteredArtists([]);
  };
  const handleAlbumTextChange = (text: string) => {
    setAlbumName(text);
    setSelectedAlbumId(null);
    setFilteredAlbums(text
      ? albums.filter(a => a.name.toLowerCase().includes(text.toLowerCase()))
      : []);
  };
  const handleAlbumSelect = (album: Album) => {
    setAlbumName(album.name);
    setSelectedAlbumId(album.id);
    setFilteredAlbums([]);
  };

  // Image picker
  const handleAddImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages(prev => [...prev, ...(result.assets||[])]);
    }
  };

  // Validate and submit
  async function handleValidate() {
    // 1) validations de base
    if (!title || !description || !price || !quantity || !releaseYear || !categoryId || !state) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (!artistName.trim()) {
      alert('L’artiste est obligatoire');
      return;
    }

    // 2) créer l’artiste si besoin
    let artistId = selectedArtistId;
    if (!artistId) {
      const resA = await fetch('http://localhost:8090/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: artistName.trim() } as ArtistPayload),
      });
      if (!resA.ok) {
        const err = await resA.json();
        alert( err.message || 'Impossible de créer l’artiste');
        return;
      }
      artistId = (await resA.json()).id;
    }
    // 2) déterminer l’ID de l’album : on évite de recréer un doublon
    let albumId = selectedAlbumId;
    const nameTrim = albumName.trim();
    if (nameTrim && !albumId) {
      // rechercher dans la liste chargée
      const existing = albums.find(a =>
        a.name.toLowerCase() === nameTrim.toLowerCase()
      );
      if (existing) {
        albumId = existing.id;
      } else {
        // créer seulement si inexistant
        const resB = await fetch('http://localhost:8090/api/albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameTrim } as AlbumPayload),
        });
        if (!resB.ok) {
          const err = await resB.json();
          alert(err.message || 'Impossible de créer l’album');
          return;
        }
        albumId = (await resB.json()).id;
      }
    }

    // 3) poster le produit
  const productData = {
    title,
    description,
    price: parseFloat(price),
    quantity: parseInt(quantity, 10),
    releaseYear: parseInt(releaseYear, 10),
    userId,                          // issu de useAuth()
    artist: { id: artistId! },      // idem pour artistId déterminé plus haut
    category: { id: parseInt(categoryId, 10) },
    album:  albumId ? { id: albumId } : null,
    status: 'AVAILABLE',
    state,
  };

  const resP = await fetch('http://localhost:8090/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!resP.ok) {
    const err = await resP.json();
    alert(err.message || 'Impossible de créer le produit');
    return;
  }
  const { id: productId } = await resP.json();


    /// 4) upload des images — une requête par fichier, part 'file'
    for (let i = 0; i < images.length; i++) {
    const asset = images[i]

    // 1) charger la donnée binaire (nécessaire sur web + mobile)
    const response = await fetch(asset.uri)
    const blob = await response.blob()

    // 2) construire le FormData avec une vraie 'file'
    const formData = new FormData()
    formData.append('file', blob, `photo-${i}.jpg`)

    // 3) poster vers /api/images/upload?productId=...
    const resI = await fetch(
      `http://localhost:8090/api/images/upload?productId=${productId}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!resI.ok) {
      console.error('Erreur upload image', i, await resI.text())
      alert(
        `Produit créé, mais échec de l’upload de l’image #${i + 1}`
      )
      // on continue quand même
    }
  }

    alert('Annonce ajoutée avec succès !');
    // … reset du formulaire …
    setTitle(''); setDescription(''); setPrice('');
    setQuantity(''); setReleaseYear(''); setCategoryId('');
    setState(''); setArtistName(''); setAlbumName('');
    setSelectedArtistId(null); setSelectedAlbumId(null);
    setFilteredArtists([]); setFilteredAlbums([]); setImages([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ajouter une annonce</Text>

        {/* --- Titre --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre du produit *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : Abbey Road"
          />
        </View>

        {/* --- Artiste autocomplete --- */}
        <View style={[styles.inputGroup, styles.autocompleteGroup, { zIndex: 3 }]}>
          <Text style={styles.label}>Artiste *</Text>
          <Autocomplete
            data={filteredArtists}
            value={artistName}
            onChangeText={handleArtistTextChange}
            placeholder="Tapez un nom..."
            inputContainerStyle={styles.autocompleteInputContainer}
            containerStyle={styles.autocompleteWrapper}
            listContainerStyle={styles.autocompleteListContainer}
            hideResults={!filteredArtists.length}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              nestedScrollEnabled: true,
              renderItem: ({ item }) => (
                <TouchableOpacity
                  style={styles.autocompleteItem}
                  onPress={() => handleArtistSelect(item)}
                >
                  <Text style={styles.autocompleteItemText}>{item.name}</Text>
                </TouchableOpacity>
              ),
              keyExtractor: (item) => item.id.toString(),
            }}
          />
        </View>

        {/* --- Album autocomplete --- */}
        <View style={[styles.inputGroup, styles.autocompleteGroup, { zIndex: 2 }]}>
          <Text style={styles.label}>Album</Text>
          <Autocomplete
            data={filteredAlbums}
            value={albumName}
            onChangeText={handleAlbumTextChange}
            placeholder="Tapez un titre..."
            inputContainerStyle={styles.autocompleteInputContainer}
            containerStyle={styles.autocompleteWrapper}
            listContainerStyle={styles.autocompleteListContainer}
            hideResults={!filteredAlbums.length}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              nestedScrollEnabled: true,
              renderItem: ({ item }) => (
                <TouchableOpacity
                  style={styles.autocompleteItem}
                  onPress={() => handleAlbumSelect(item)}
                >
                  <Text style={styles.autocompleteItemText}>{item.name}</Text>
                </TouchableOpacity>
              ),
              keyExtractor: (item) => item.id.toString(),
            }}
          />
        </View>

        {/* --- Année de sortie --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Année de sortie *</Text>
          <TextInput
            style={[styles.textInput, styles.yearInput]}
            value={releaseYear}
            onChangeText={setReleaseYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* --- Ajouter des images --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ajouter des images</Text>
          <TouchableOpacity style={styles.imageButton} onPress={handleAddImages}>
            <FontAwesome name="camera" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Aperçu */}
        {images.length > 0 && (
          <View style={styles.previewContainer}>
            {images.map((asset, idx) => (
              <Image
                key={idx}
                source={{ uri: asset.uri }}
                style={styles.previewImage}
              />
            ))}
          </View>
        )}

        {/* --- Catégorie --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catégorie *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryId}
              onValueChange={setCategoryId}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner..." value="" />
              {categories.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id.toString()} />
              ))}
            </Picker>
          </View>
        </View>

        {/* --- Description --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* --- État --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>État *</Text>
          <View style={styles.pickerStateContainer}>
            <Picker
              selectedValue={state}
              onValueChange={setState}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner..." value="" />
              {productStates.map((c, i) => (
                <Picker.Item key={i} label={c.label} value={c.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* --- Prix & Quantité --- */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Prix *</Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.inputGroup, { width: 100 }]}>
            <Text style={styles.label}>Quantité *</Text>
            <TextInput
              style={styles.textInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* --- Valider --- */}
        <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
          <Text style={styles.validateButtonText}>Valider</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollContent: {
    padding: 20, 
    paddingBottom: 40 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: colors.brownText, 
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup:{ 
    marginBottom: 20 }
    ,
  label: { fontSize: 16, 
    color: '#666', 
    marginBottom: 8, 
    fontWeight: '500' 
  },
  autocompleteGroup: { 
    marginBottom: 40 
  },
  row: { 
    flexDirection: 'row' 
  },
  textInput: {
    backgroundColor: 'white', 
    borderRadius: 8,
    paddingHorizontal: 15, 
    paddingVertical: 12,
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  yearInput: { 
    width: 120 
  },
  imageButton: {
    backgroundColor: 'white', 
    borderRadius: 8,
    padding: 15, 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
  },
  previewContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginBottom: 20 },
  previewImage: { 
    width: 80, 
    height: 80, 
    margin: 5, 
    borderRadius: 8 
  },
  pickerContainer: { 
    borderRadius: 8, 
    backgroundColor: '#F0F0F0', 
    borderWidth:1, 
    borderColor:'#E0E0E0', 
    elevation:2 
  },
  pickerStateContainer: { 
    width:150, 
    borderRadius:8, 
    backgroundColor:'#F0F0F0', 
    borderWidth:1, 
    borderColor:'#E0E0E0', 
    elevation:2 },
  picker: { 
    height: 50 
  },
  autocompleteWrapper: { 
    flex: 1 
  },
  autocompleteInputContainer:{ 
    borderWidth:1, 
    borderColor:'#E0E0E0', 
    backgroundColor:'white', 
    borderRadius:8, 
    paddingHorizontal:15, 
    height:48 
  },
  autocompleteListContainer: { 
    position:'absolute', 
    top:48, 
    left:0, 
    right:0, 
    maxHeight:120, 
    backgroundColor:'white', 
    borderWidth:1, 
    borderColor:'#E0E0E0', 
    borderTopWidth:0, 
    borderBottomLeftRadius:8, 
    borderBottomRightRadius:8 
  },
  autocompleteItem: { 
    padding:12, 
    borderBottomWidth:1, 
    borderBottomColor:'#F0F0F0' 
  },
  validateButton:    {
    backgroundColor: colors.green, 
    borderRadius:25,
    paddingVertical:15, 
    paddingHorizontal:40,
    alignSelf:'flex-end',
    marginTop:30,
    elevation:4
  },
  validateButtonText:{ 
    color:'white', 
    fontSize:18, 
    fontWeight:'bold' 
  },
  autocompleteItemText:{ 
    fontSize: 16, 
    color: '#333' 
  },
});
