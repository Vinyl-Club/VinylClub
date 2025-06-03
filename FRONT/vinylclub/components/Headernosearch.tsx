import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import colors from '@/constants/colors';


export default function Headernosearch() {
  return (
    <View style={styles.container}>
      {/* Logo displayed on the left side  */}
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Arrange logo and search bar horizontally
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: colors.green,
    height: 90, // Header height
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 20, // Space between logo and search bar
  },
});