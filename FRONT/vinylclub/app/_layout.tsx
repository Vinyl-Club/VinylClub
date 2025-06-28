// app/_layout.tsx
import { Stack, Redirect,  } from 'expo-router';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaProvider>
      {/* Use <Layout> to wrap any non-<Screen> children */}
      
        <SafeAreaView style={styles.safeTop} edges={['top']} />
     
      <View style={styles.container}>
        <Stack>
          {!isAuthenticated && <Redirect href="/login" />}

          {/* public screens */}
          <Stack.Screen name="login"    options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />

          {/* your tab-layout */}
          <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />

          {/* your dynamic detail screen */}
          <Stack.Screen
            name="Details/[id]"
            options={{ headerShown: false, title: 'Détails du produit' }}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    backgroundColor: colors.green,
  },
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
});
