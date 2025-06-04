import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import ProfileScreen from '@/screens/PorfileScreen';
import Headernosearch from '@/components/Headernosearch';

export default function Profile() {
    return (
        // <HomeScreen></HomeScreen>
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