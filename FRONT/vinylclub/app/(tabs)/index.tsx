// This file is used to render the home screen of the app
import HomeScreen from '@/screens/HomeScreen';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import colors from '@/constants/colors';

export default function Index() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Rafraîchir la page d'accueil quand on y revient (clic sur tab home)
  useFocusEffect(
    useCallback(() => {
      console.log('Page d\'accueil refocusée - déclenchement du rafraîchissement');
      
      // Forcer le re-render en changeant la key
      setRefreshKey(prev => prev + 1);
      
    }, [])
  );

  return (
    <View style={styles.container}>
      <HomeScreen key={refreshKey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  }
});