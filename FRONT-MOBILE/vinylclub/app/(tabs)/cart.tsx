import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';
import CartScreen from '@/screens/CartScreen';

// Main cart screen component
export default function cart() {
    return (
        // Container view for the cart screen
        <View style={styles.container}>
            {/* Header without search bar */}
            <Headernosearch/>
            {/* Main cart content */}
            <CartScreen />
        </View>
    );
}

// Styles for the container
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, // Set background color from constants
    }
});