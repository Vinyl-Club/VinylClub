import { Stack } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>

      {/* SafeArea en haut - couleur du header (vert) */}
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Contenu principal avec fond beige */}
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="id" options={{ headerShown: false }} />
        </Stack>
      </View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: colors.green, // ← la couleur verte de ton header
  },
  container: {
    flex: 1,
    backgroundColor: colors.beige, // ← fond beige de ta page
  },
});
