import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';
import RegisterScreen from '@/screens/RegisterScreen';


export default function Register() {
    return (
        <View style={styles.container}>
            <Headernosearch />
            <RegisterScreen />
        </View>
    );
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, 
    } 
});