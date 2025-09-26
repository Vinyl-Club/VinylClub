import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import LoginScreen from '@/screens/LoginScreen';
import Headernosearch from '@/components/Headernosearch';


export default function Login() {
    return (
        <View style={styles.container}>
            <Headernosearch />
            <LoginScreen />
        </View>
    );
    }
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.beige, 
    }
});