
import AddScreen from '@/screens/AddScreen';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

export default function add() {
  return (
  
    <View style={styles.container}>
      <AddScreen></AddScreen>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige, // ← fond beige de ta page
  }
});