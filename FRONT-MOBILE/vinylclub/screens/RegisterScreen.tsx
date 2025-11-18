import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    // State hooks for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');

    const router = useRouter();

    // Handles registration logic and form validation
    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            alert("Tous les champs sont obligatoires.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Send registration data to backend API
            const response = await fetch('http://localhost:8090/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                }),
            });

            if (response.ok) {
                alert("Compte créé avec succès !");
                router.replace('/login'); // Redirect to login on success
            } else {
                const error = await response.json();
                alert("Erreur lors de l'inscription : " + (error.message || "inconnue"));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau ou serveur.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mot de passe *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* Confirm password input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmation du mot de passe *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmation du mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            {/* Last name input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>

            {/* First name input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Prénom *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                />
            </View>

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
}

// Styles for the registration screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.brownText, 
        textAlign: 'center',
        marginVertical: 16,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 8,
        boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
        backgroundColor: 'white',
        color: '#666',
    },
    button: {
        backgroundColor: colors.green, // Couleur verte pour le bouton
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'flex-end',
        marginRight: 16,
    },
    buttonText: {
        color: 'black',
        fontWeight: '600',
    },
});
