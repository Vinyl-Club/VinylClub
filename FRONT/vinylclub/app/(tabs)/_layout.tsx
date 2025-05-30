// Import necessary components and icons
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';

// Define the TabLayout component
export default function TabLayout() {
  return (
    // Tabs component to create a tab-based navigation
    <Tabs
      screenOptions={{
        // Set the active tab icon color to white
        tabBarActiveTintColor: 'white',
        // Set the inactive tab icon color to black
        tabBarInactiveTintColor: 'black',
        // Style the header with a green background
        headerStyle: {
          backgroundColor: colors.green,
        },
        // Hide the header shadow
        headerShadowVisible: false,
        // Set the header text color to white
        headerTintColor: '#fff',
        // Style the tab bar with an orange background
        tabBarStyle: {
          backgroundColor: colors.orange,
        },
      }}
    >
      {/* Define a tab screen for the home page */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil', // Set the title of the screen
          tabBarLabel: 'Accueil', // Set the label of the tab
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({ color }) => (
            // Use the Ionicons component to render a home icon
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />

      {/* Define a tab screen for the add page */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter', // Set the title of the screen
          tabBarLabel: 'Ajouter', // Set the label of the tab
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({ color }) => (
            // Use the Ionicons component to render an add icon
            <Ionicons name="add" size={30} color={color} />
          ),
        }}
      />

      {/* Define a tab screen for the profile page */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil', // Set the title of the screen
          tabBarLabel: 'Profil', // Set the label of the tab
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({ color }) => (
            // Use the Ionicons component to render a person icon
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />

      {/* Define a tab screen for the cart page */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier', // Set the title of the screen
          tabBarLabel: 'Panier', // Set the label of the tab
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({ color }) => (
            // Use the Ionicons component to render a cart icon
            <Ionicons name="cart" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
