import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useCategories } from '../hooks/useCategories';
import { Categories } from '@/types/index';

export function NavBar() {
    // Custom hook to fetch categories data
    const { categories, loading } = useCategories();
    // State to keep track of the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Display a loading indicator while data is being fetched
    if (loading) {
        return <ActivityIndicator size="small" color="#000" />;
    }

    return (
        <View style={styles.container}>
            {/* Horizontal scrollable list of categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                {categories.map((category: Categories, index: number) => (
                    <View key={category.id} style={styles.categoryWrapper}>
                        {/* Pressable component for each category item */}
                        <Pressable
                            onPress={() => setSelectedCategory(category.id)}
                            style={[
                                styles.categoriesItem,
                                selectedCategory === category.id && styles.categoriesItemSelected,
                            ]}
                        >
                            {/* Text for the category name */}
                            <Text
                                style={[
                                    styles.categoriesText,
                                    selectedCategory === category.id && styles.categoriesTextSelected,
                                ]}
                            >
                                {category.name}
                            </Text>
                        </Pressable>

                        {/* Separator between categories, except after the last item */}
                        {index !== categories.length - 1 && (
                            <Text style={styles.separator}>|</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

// Styles for the components
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D48541',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    categoryWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoriesItem: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoriesItemSelected: {
        backgroundColor: '#B96D2E',
    },
    categoriesText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'serif',
    },
    categoriesTextSelected: {
        fontWeight: 'bold',
        color: '#FFF',
    },
    separator: {
        fontSize: 16,
        color: '#000',
    },
});
