import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import CardItem from '@/components/CardItem'; // adapte le chemin si nécessaire
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';

export default function ProfileScreen ()  {
    const { products } = useProducts();
    const { addresses } = useAddresses();
    const currentUserId = 1; // ← Remplace par un vrai user ID (auth)
    const router = useRouter();

    const userProducts = products.filter(p => p.userId === currentUserId);

    return (
        <ScrollView style={styles.container}>
        {/* Section du profil */}
        <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Votre profil</Text>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom</Text>
            <TextInput style={styles.input} placeholder="Nom" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput style={styles.input} placeholder="Prénom" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer mot de passe</Text>
            <TextInput style={styles.input} placeholder="Confirmer mot de passe" secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput style={styles.input} placeholder="Adresse" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput style={styles.input} placeholder="Code postal" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Ville</Text>
            <TextInput style={styles.input} placeholder="Ville" />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Pays</Text>
            <TextInput style={styles.input} placeholder="Pays" />
            </View>
        </View>

        {/* Section des annonces */}
        <Text style={styles.sectionTitle}>Vos annonces</Text>
        <ScrollView style={styles.annoncesSection}>
            {userProducts.map((product) => {
                const address = addresses.find(a => a.user.id === product.userId);
                return (
                    <CardItem key={product.id} product={product} city={address?.city} />
                );
            })}
        </ScrollView>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
            style={[styles.button, styles.supprimerButton]}
            onPress={() => router.push({ pathname: "/login" })}
            >
            <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={[styles.button, styles.validerButton]}
            onPress={() => router.push({ pathname: "/profile", params: { id: String(currentUserId) } })}
            onPress={() => router.push({ pathname: "/profile", params: { id: String(user.id) } })}
            >
            <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    profileSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.brownText, 
        marginVertical: 16,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 7,
        elevation: 4,
        color: '#666',
    },
    annoncesSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },  
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    button: {
        padding: 10,
        borderRadius:20,
        width: '35%',
        alignItems: 'center',
    },
    supprimerButton: {
        backgroundColor: colors.orange,
    },
    validerButton: {
        backgroundColor: colors.green, // Couleur verte pour le bouton
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});


