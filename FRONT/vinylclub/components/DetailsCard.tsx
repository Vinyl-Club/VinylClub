// DetailsCard.tsx
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';

export default function DetailsCard() {
    return (
        <View>
        <Text style={styles.title}>Titre de l’annonce</Text>
        
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

        <Text>Date de l’annonce</Text>
        
        <View style={styles.infoDescription}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.price}>Prix : €</Text>
        </View>

        <Text>Nom de l’album \ Nom de l’artiste</Text>
        <Text>État</Text>
        <Text>Année de sortie</Text>
        <Text>Style de musique</Text>

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
