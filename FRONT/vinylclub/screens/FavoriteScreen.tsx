import { View, Text, ScrollView,StyleSheet, } from 'react-native';
import colors from '@/constants/colors';
import Headernosearch from '@/components/Headernosearch';

export default function FavoriteScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Headernosearch />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.sectionTitle}>Vos Favoris</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: colors.brownText,
    },
})