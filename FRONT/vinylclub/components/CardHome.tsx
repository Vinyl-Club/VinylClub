import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '@/constants/colors';

export default function CardHome() {
    return (
        <View style={styles.card}>
        {/* Image à gauche */}
            <Image
                source={require('@/assets/images/demo.png')} // remplace par ton image vinyle+cover
                style={styles.image}
            />

        {/* Contenu à droite */}
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Titre de l’annonce</Text>
                    <View style={styles.artistPriceRow}>
                        <Text style={styles.subText}>Nom de l’artiste</Text>
                        <Text style={styles.price}>Prix €</Text>
                    </View>
                    <Text style={styles.subText}>Style de musique</Text>
                    <Text style={styles.subText}>Localisation</Text>
                </View>

                <View style={styles.bottomRow}>
                    
                    <FontAwesome name="heart-o" size={24} color="black" style={styles.icon} />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Voir le détail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
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
  textContainer: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  },
  price: {
    color: colors.brownText,
    fontWeight: 'bold',
    marginEnd: 10,
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'Black',
    fontWeight: '500',
  },
  artistPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},

});
