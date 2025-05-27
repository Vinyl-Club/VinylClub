import { View, ScrollView } from 'react-native'
import Header from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import DetailsCard from '@/components/DetailsCard';

export default function DetailsScreen() {
    return (
        <View style={{ flex: 1 }}>
        <Header onSearch={(text: string) => console.log('Recherche :', text)} />
        <NavBar />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <DetailsCard />
        </ScrollView>
        </View>
    );
}