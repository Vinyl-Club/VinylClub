import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import FavoriteScreen from '@/screens/FavoriteScreen';

export default function favorite() {
    return (
        <View style={styles.container}>
            <FavoriteScreen />  
            
        </View>
    );
}
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, 
    },
});