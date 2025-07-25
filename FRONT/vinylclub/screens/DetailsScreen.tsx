// Import necessary components from React Native and local files
import { View, ScrollView } from 'react-native';
import { useState} from 'react';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import DetailsCard from '@/components/DetailsCard';

// Define the DetailsScreen component
export default function DetailsScreen() {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const handleSearch = (query: string) => {
    router.push(`/?search=${encodeURIComponent(query)}`);
    };

    return (
        // Main container with flex: 1 to fill the entire screen
        <View style={{ flex: 1 }}>
            {/* Header component with a search function that logs the search text */}
            <Header onSearch={handleSearch} />

            {/* Navigation bar component */}
            <NavBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* ScrollView to enable scrolling within the content area */}
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* DetailsCard component to display detailed information */}
                <DetailsCard />
            </ScrollView>
        </View>
    );
}
// This component serves as the details screen for displaying detailed information about a product or item.

