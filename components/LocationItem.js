import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const LocationItem = ({ title, address, coordinates, connectedNode, onPress }) => (
    <TouchableOpacity onPress={() => onPress({ title, coordinates, connectedNode })}>
        <View style={styles.locationItem}>
            <View style={styles.timeIcon}>
                <FontAwesome5 name="clock" size={16} color="#000" />
            </View>
            <View style={styles.locationDetails}>
                <Text style={styles.locationTitle}>{title}</Text>
                <Text style={styles.locationAddress}>{address}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    locationItem: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        flex: 1,
    },
    timeIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    locationDetails: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 16,
        marginBottom: 2,
    },
    locationAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
});

export default LocationItem;
