// This file is used to render the home screen of the app
import HomeScreen from '@/screens/HomeScreen';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';




export default function index() {
  return (
    // <HomeScreen></HomeScreen>
    <View style={styles.container}>
      <HomeScreen></HomeScreen>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  }
});