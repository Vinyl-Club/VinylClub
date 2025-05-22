import { View } from 'react-native';
import Header from '@/components/Header';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header onSearch={(text: string) => console.log('Recherche :', text)} />

      {/* Reste du contenu */}
    </View>
  );
}