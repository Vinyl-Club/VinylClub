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
import colors from '@/constants/colors';

interface NavBarProps {
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
}

export function NavBar({ selectedCategory, onSelectCategory }: NavBarProps) {
    // Custom hook to fetch categories data
    const { categories, loading } = useCategories();

    // Display a loading indicator while data is being fetched
    if (loading) {
        return <ActivityIndicator size="small" color="#000" />;
    }

    return (
    <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
            {/* “Toutes” */}
            <Pressable
            onPress={() => onSelectCategory(null)}
            style={[
                styles.categoriesItem,
                selectedCategory === null && styles.categoriesItemSelected,
            ]}
            >
            <Text
                style={[
                styles.categoriesText,
                selectedCategory === null && styles.categoriesTextSelected,
                ]}
            >
                Toutes
            </Text>
            </Pressable>

            {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryWrapper}>
                <Pressable
                onPress={() => onSelectCategory(cat.id)}
                style={[
                    styles.categoriesItem,
                    selectedCategory === cat.id && styles.categoriesItemSelected,
                ]}
                >
                <Text
                    style={[
                    styles.categoriesText,
                    selectedCategory === cat.id && styles.categoriesTextSelected,
                    ]}
                >
                    {cat.name}
                </Text>
                </Pressable>
                <Text style={styles.separator}>|</Text>
            </View>
            ))}
        </ScrollView>
        </View>
    );
}

// Styles for the components
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.orange,
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
