import { View,  } from 'react-native';
import Header from '@/components/Header';
import {NavBar} from '@/components/NavBar';
import CardHome from '@/components/CardHome';


export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header onSearch={(text: string) => console.log('Recherche :', text)} />
      <NavBar />
      <CardHome />
    </View>
  );
}