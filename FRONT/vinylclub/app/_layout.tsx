// Import necessary components and modules
import { Stack } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

// Define the RootLayout component
export default function RootLayout() {
  return (
    // SafeAreaProvider to handle safe area insets for the app
    <SafeAreaProvider>
      {/* SafeAreaView at the top with green background color for the header */}
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Main content container with beige background */}
      <View style={styles.container}>
        {/* Stack navigator for handling screen navigation */}
        <Stack>
          {/* Define a screen named "id" with hidden header */}
          <Stack.Screen name="id" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

// Define styles for the component using StyleSheet
const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: colors.green, // Green background color for the header
  },
  container: {
    flex: 1,
    backgroundColor: colors.beige, // Beige background color for the main content
  },
});
