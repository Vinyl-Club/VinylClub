// This file is used to render the home screen of the app
import HomeScreen from '@/screens/HomeScreen';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import colors from '@/constants/colors';

export default function Index() {
  // State to force re-render of HomeScreen
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh the home page when it regains focus (e.g., when the home tab is clicked)
  useFocusEffect(
    useCallback(() => {
      console.log('Home page refocused - triggering refresh');
      
      // Force re-render by updating the key
      setRefreshKey(prev => prev + 1);
      
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Pass a changing key to HomeScreen to force remount on refresh */}
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