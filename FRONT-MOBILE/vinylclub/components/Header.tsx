import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import colors from '@/constants/colors';

// interface Props {
//   onSearch: (text: string) => void;
// }

export default function Header({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <View style={styles.container}>
      {/* Logo displayed on the left side  */}
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Search bar displayed next to the logo */}
      <SearchBar
        placeholder="Rechercher..."
        onSearch={onSearch} // Function to handle search
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