// app/details.tsx
import { View } from 'react-native';
import DetailsScreen from '@/screens/DetailsScreen';
import colors from '@/constants/colors';

export default function details() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.beige }}>
            <DetailsScreen />
        </View>
    );
}
