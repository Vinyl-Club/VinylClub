
import AddScreen from '@/screens/AddScreen';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function add() {
  return (
    // <HomeScreen></HomeScreen>
    <View style={styles.container}>
      <AddScreen></AddScreen>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6EBDD',
  }
});