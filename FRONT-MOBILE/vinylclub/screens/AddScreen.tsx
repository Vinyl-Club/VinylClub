import { View, Text } from 'react-native';
import Headernosearch from '@/components/Headernosearch';
import AddListingPage from '@/components/AddCard';

export default function AddScreen() {
    return (
        <View style={{ flex: 1 }}>
        <Headernosearch />
        <AddListingPage />
        </View>
    );
}