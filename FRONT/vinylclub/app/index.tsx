import { View } from "react-native";


import Header from '@/components/Header';

export default function index() {
  return (
    <View style={{ flex: 1 }}>
      <Header onSearch={(text: string) => { /* handle search here */ }} />

      {/* Reste du contenu */}
    </View>
  );
}
