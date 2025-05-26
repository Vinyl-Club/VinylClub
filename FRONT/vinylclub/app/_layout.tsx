import { Stack } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>

      {/* SafeArea en haut - couleur du header (vert) */}
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Contenu principal avec fond beige */}
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: '#8AA39F', // ← la couleur verte de ton header
  },
  container: {
    flex: 1,
    backgroundColor: '#F6EBDD', // ← fond beige de ta page
  },
});
