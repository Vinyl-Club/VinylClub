import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';
import CartScreen from '@/screens/CartScreen';

export default function cart() {
    return (
        
        <View style={styles.container}>
        <Headernosearch/>
        <CartScreen />
        
        </View>
    );
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, // ← fond beige de ta page
    }
});