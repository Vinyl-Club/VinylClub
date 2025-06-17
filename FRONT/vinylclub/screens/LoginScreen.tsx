import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  // Toujours true au montage => popup systématique
  const [showGDPR, setShowGDPR] = useState(true);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    const success = await login(email.trim(), password);
    if (success) {
      router.push('/(tabs)');
    } else {
      alert("Échec de la connexion. Vérifie tes identifiants.");
    }
  };

  const handleSignup = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Modal RGPD */}
      <Modal visible={showGDPR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Vos informations ne seront ni revendues, ni partagées.
              Vous pouvez supprimez votre compte à tous moment.  
              Nous respectons votre vie privée.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowGDPR(false)}
            >
              <Text style={styles.modalButtonText}>J’ai compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Formulaire de connexion */}
      <Text style={styles.title}>Bienvenue sur{'\n'}Vinyl.Club</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#333"
        keyboardType="email-address"
        autoCapitalize="none"
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
        boxShadow: '0px 2px 7px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 4,
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

  // Modal RGPD
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24,
    marginHorizontal: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  modalButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})