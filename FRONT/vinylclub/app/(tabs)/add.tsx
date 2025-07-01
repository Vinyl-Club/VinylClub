import AddScreen from '@/screens/AddScreen'; // Import the AddScreen component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors'; // Import custom color constants

// Main component for the Add tab/page
export default function add() {
  return (
    // Container view with custom styles
    <View style={styles.container}>
      {/* Render the AddScreen component */}
      <AddScreen />
    </View>
  );
}

// Styles for the container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    backgroundColor: colors.beige, // Set background color to beige
  }
});