// Import necessary components from React Native and local files
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import CardHome from '@/components/CardHome';

// Define the HomeScreen component
export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [searchQuery, setSearchQuery] = useState(search?? '');

  useEffect(() => {
    if (search !== undefined) {
      setSearchQuery(search);
    }
  }, [search]);

  return (
    // Main container with flex: 1 to fill the entire screen
    <View style={{ flex: 1 }}>
      {/* Header component with a search function that logs the search text */}
      <Header onSearch={setSearchQuery} />
      
      {/* Navigation bar component */}
      <NavBar />

      {/* CardHome component to display the list of products */}
      <CardHome searchQuery={searchQuery}/>
    </View>
  );
}


