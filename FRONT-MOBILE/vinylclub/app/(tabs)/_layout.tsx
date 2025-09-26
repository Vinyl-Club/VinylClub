// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';

// Main tab layout component for the app
export default function TabLayout() {
  return (
    <Tabs
      // Global options for all tab screens
      screenOptions={{
        tabBarActiveTintColor: 'white', // Active tab icon/text color
        tabBarInactiveTintColor: 'black', // Inactive tab icon/text color
        headerStyle:        { backgroundColor: colors.green }, // Header background color
        headerShadowVisible: false, // Remove header shadow
        headerTintColor:    '#fff', // Header text/icon color
        tabBarStyle:        { backgroundColor: colors.orange }, // Tab bar background color
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          headerShown: false, // Hide header for this screen
          tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />, // Home icon
        }}
      />
      {/* Add tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarLabel: 'Ajouter',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="add" size={30} color={color} />, // Add icon
        }}
      />
      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />, // Profile icon
        }}
      />
      {/* Favorites tab */}
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favoris',
          tabBarLabel: 'Favoris',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={30} color={color} />, // Heart icon
        }}
      />
      {/* Cart tab */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarLabel: 'Panier',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={30} color={color} />, // Cart icon
        }}
      />
    </Tabs>
  );
}
