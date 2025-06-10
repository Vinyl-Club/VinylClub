import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const {login} = useAuth();

    const handleLogin = async () => {
    const success = await login(email, password);

        if (success) {
        router.push('/(tabs)');
        } else {
        alert("Échec de la connexion. Vérifie tes identifiants.");
        }
    };

    const handleSignup = () => {
        router.push('/register'); // Change selon ta route d’inscription
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bienvenue sur{'\n'}Vinyl.Club</Text>

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#333"
            onChangeText={setEmail}
            value={email}
        />
        <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#333"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
        />

        <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.link}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.brownText,
        marginBottom: 50,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 7,
        elevation: 4,
        color: '#666',
    },
    link: {
        color: '#333',
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: colors.green,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: 'black',
        fontWeight: '600',
    },
});

