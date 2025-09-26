import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


interface Props {
    placeholder?: string;
    onSearch: (text: string) => void;
}

export default function SearchBar({ placeholder = 'Rechercher...', onSearch }: Props) {
    const [searchText, setSearchText] = useState(''); // Managing search text state using useState

  // Handle pressing the search icon or submitting from the keyboard
    const handleSearchPress = () => {
        if (searchText.trim() !== '') {
        onSearch(searchText);      // Trigger search
        console.log('Search initiated with:', searchText);  // You can add any additional logic here, like navigating to a search results page
        setSearchText('');         // Clear input field after search
        }
    };

    return (
        <View style={styles.searchContainer}>
         {/* Text input field for search */}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={searchText}
                onChangeText={setSearchText}
                
                onSubmitEditing={handleSearchPress} // Allow search from keyboard (e.g. "Enter")
                placeholderTextColor="#888"
                returnKeyType="search"
            />

            {/* Clickable search icon (magnifying glass) */}
            <Pressable onPress={handleSearchPress}>
                <Ionicons name="search" size={20} color="#888" style={styles.icon} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        // Layout styling for the search bar
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 35,
        flex: 1, // Expand to available horizontal space
    },
    input: {
        // Input text styling
        flex: 1,
        fontSize: 16,
        paddingVertical: 6,
    },
    icon: {
        // Search icon spacing
        marginLeft: 8,
    },
});
