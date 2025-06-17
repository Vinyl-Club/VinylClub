// Import necessary components from React Native and local files
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import CardHome from '@/components/CardHome';
import { useAuth } from '@/hooks/useAuth';
import colors from '@/constants/colors';


// Define the HomeScreen component
export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [searchQuery, setSearchQuery] = useState(search?? '');
  const { logout, user } = useAuth();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (search !== undefined) {
      setSearchQuery(search);
    }
  }, [search]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    // Main container with flex: 1 to fill the entire screen
    <View style={{ flex: 1 }}>
      {/* Header component with a search function that logs the search text */}
      <Header onSearch={setSearchQuery} />
      
      {/* Navigation bar component */}
      <NavBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {user && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenue, {user.firstName} !</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* CardHome component to display the list of products */}
      <CardHome 
        searchQuery={searchQuery}
        categoryId={selectedCategory}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:20,
    marginTop: 10,
  },
  logoutButton: {
    padding: 5,
  },
  logoutText: {
    color: 'black',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.brownText, 
  },
});
