// app/(tabs)/_layout.tsx
import { Tabs,  } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        headerStyle:        { backgroundColor: colors.green },
        headerShadowVisible: false,
        headerTintColor:    '#fff',
        tabBarStyle:        { backgroundColor: colors.orange },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarLabel: 'Ajouter',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="add" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favoris',
          tabBarLabel: 'Favoris',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarLabel: 'Panier',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}
