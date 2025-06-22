import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';

export default function favorite() {
    return (
        <View style={styles.container}>
            <Headernosearch />
            
        </View>
    );
}
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, 
    },
});