import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '@/constants/colors';
import ProfileScreen from '@/screens/PorfileScreen';
import Headernosearch from '@/components/Headernosearch';

export default function Profile() {
    
    const reloadProfileData = useCallback(() => {
       
        console.log('Onglet Profil activé - rechargement des données');
        
    }, []);

    useFocusEffect(
        useCallback(() => {
            reloadProfileData();
        }, [reloadProfileData])
    );

    return (
        <View style={styles.container}>
            <Headernosearch />
            <ProfileScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige,
    }
});