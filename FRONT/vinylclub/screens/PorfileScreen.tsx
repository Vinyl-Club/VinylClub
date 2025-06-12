import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import CardItem from '@/components/CardItem';
import useProducts from '@/hooks/useProducts';
import { useAddresses } from '@/hooks/useAddresses';
import { useUser } from '@/hooks/useUser';

export default function ProfileScreen() {
    const { products } = useProducts();
    const { addresses, addAddress, updateAddress } = useAddresses();
    const { user, loading, error, updateUser, loadUser } = useUser();  // ← ajout de loadUser
    const router = useRouter();

    // états du formulaire
    const [firstName, setFirstName] = useState('');
    const [lastName,  setLastName]  = useState('');
    const [email,     setEmail]     = useState('');
    const [phone,     setPhone]     = useState('');
    const [street,    setStreet]    = useState('');
    const [zipCode,   setZipCode]   = useState('');
    const [city,      setCity]      = useState('');
    const [country,   setCountry]   = useState('');

    const isInitialized = useRef(false);

    // ← Charger l'utilisateur au montage
    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ← Hydrater le formulaire une seule fois
    useEffect(() => {
        if (user && addresses.length > 0 && !isInitialized.current) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhone(user.phone ?? '');

        const ua = addresses.find(a => a.user.id === user.id);
        if (ua) {
            setStreet(ua.street);
            setZipCode(ua.zipCode);
            setCity(ua.city);
            setCountry(ua.country);
        }

        isInitialized.current = true;
        }
    }, [user, addresses]);

    const userProducts = products.filter(p => p.userId === user?.id);

    const handleSave = async () => {
        try {
        // 1) update user (sans email)
        await updateUser({ firstName, lastName, phone });
        alert('Vos informations ont été mises à jour');

        // 2) update/add address si modifiée
        const ua = addresses.find(a => a.user.id === user!.id);
        const changed =
            (!ua && (street || zipCode || city || country)) ||
            (ua && (
            ua.street  !== street  ||
            ua.zipCode !== zipCode ||
            ua.city    !== city    ||
            ua.country !== country
            ));
        if (changed) {
            if (ua) {
            await updateAddress({
                id: ua.id,
                street,
                zipCode,
                city,
                country,
                user: user!,
            });
            alert('Adresse mise à jour avec succès');
            } else {
            await addAddress({
                street,
                zipCode,
                city,
                country,
                user: user!,
            });
            alert('Adresse ajoutée avec succès');
            }
        }
        } catch {
        alert('Erreur lors de la sauvegarde');
        }
    };

    if (loading) return <Text>Chargement…</Text>;
    if (error)   return <Text>Erreur : {error.message}</Text>;

    // définition typée des champs
    const fields: Array<{
        label: string;
        value: string;
        setter: (t: string) => void;
        keyboardType?: KeyboardTypeOptions;
        editable?: boolean;
    }> = [
        { label: 'Nom',       value: firstName, setter: setFirstName },
        { label: 'Prénom',    value: lastName,  setter: setLastName  },
        {
        label: 'Email',
        value: email,
        setter: () => {},
        keyboardType: 'email-address',
        editable: false,
        },
        {
        label: 'Téléphone',
        value: phone,
        setter: setPhone,
        keyboardType: 'phone-pad',
        },
        { label: 'Adresse',    value: street,  setter: setStreet  },
        {
        label: 'Code postal',
        value: zipCode,
        setter: setZipCode,
        keyboardType: 'number-pad',
        },
        { label: 'Ville',      value: city,    setter: setCity    },
        { label: 'Pays',       value: country, setter: setCountry },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Votre profil</Text>

            {fields.map(({ label, value, setter, keyboardType = 'default', editable = true }, idx) => (
            <View key={idx} style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                style={[styles.input, editable === false && { backgroundColor: '#eee' }]}
                placeholder={label}
                value={value}
                onChangeText={setter}
                keyboardType={keyboardType}
                editable={editable}
                />
            </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Vos annonces</Text>
        <View style={styles.annoncesSection}>
            {userProducts.map(p => {
            const ua = addresses.find(a => a.user.id === p.userId);
            return <CardItem key={p.id} product={p} city={ua?.city} />;
            })}
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={[styles.button, styles.supprimerButton]}
            onPress={() => router.push('/login')}
            >
            <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.validerButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:      { flex: 1, padding: 16 },
    profileSection: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: colors.brownText,
    },
    inputContainer: { marginBottom: 15 },
    label:          { marginBottom: 5, fontSize: 16, fontWeight: '500', color: '#666' },
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
    annoncesSection:{ marginBottom: 20 },
    buttonContainer:{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    button:         { padding: 10, borderRadius: 20, width: '40%', alignItems: 'center' },
    supprimerButton:{ backgroundColor: colors.orange },
    validerButton:  { backgroundColor: colors.green },
    buttonText:     { color: 'black', fontWeight: 'bold' },
});
