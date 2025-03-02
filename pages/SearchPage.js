import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import LocationItem from '../components/LocationItem';
import useLocation from '../hooks/useLocation';
import { haversineDistance } from '../utils/distance';

const locationData = [
    {
        id: '1',
        title: 'Wawa',
        address:
            '3300 Market St, Philadelphia, PA 19104',
        coordinates:
        { 
            latitude: 39.95568728485659,
            longitude: -75.19106004566655,
        },
        connectedNode: 'node/4161472993',
        rating: '4.5',

    },
    {
        id: '2',
        title: 'Drexel University Recreation Center',
        address:
            'Daskalakis Athletic Center, Market Street, Philadelphia, PA, USA',
        coordinates:
        {
            latitude: 39.9561086811492,
            longitude:-75.19004848060887,
        },
        rating: '4.2',
        connectedNode: 'node/4161472993'
    },
    {
        id: '3',
        title: 'Madis Coffee Roasters',
        address: '3527 Lancaster Ave, Philadelphia, PA 19104',
        coordinates:
        {
            latitude:  39.95863712775221,
            longitude: -75.19315296393727,
        },
        connectedNode: 'node/7835909870',
        rating: '4.0',
    },
    {
        id: '4',
        title: 'Chipotle Mexican Grill',
        address: '3400 Lancaster Ave, Philadelphia, PA 19104',
        coordinates:
        {
            latitude: 39.957231275896476,
            longitude: -75.19139488696338,
        },
        connectedNode: 'node/7835909883',
        rating: '3.8',

    },
    {
        id: '5',
        title: 'Giant',
        address: '3401 Chestnut St, Philadelphia, PA 19104',
        coordinates:
        {
            latitude: 39.95490271597049,
            longitude: -75.19204323997748,
        },
        connectedNode: 'node/4696697648',
        rating: '4.6',
    }
];

const home = {
    title: 'Home',
    address: '1673 N 32th St, Philadelphia, PA 19104',
    coordinates:
    {
        latitude: 39.9584307831444,
        longitude: -75.19361355696252,
    },
}

const work = {
    title: 'Coffee',
    address: 'Madis',
    coordinates:
    {
        latitude: 39.95863712775221,
        longitude: -75.19315296393727,
    },
    connectedNode: 'node/7835909870',
    rating: '4.0',
}

const school = {
    title: 'Gym',
    address: 'Recreation Center',
    coordinates:
    {
        latitude: 39.9561086811492,
        longitude:-75.19004848060887,
    },
    connectedNode: 'node/3413844294',
    rating: '4.1',
}

const SearchPage = ({ handleLocationPress }) => {
     // Get the current user location using your custom hook
  const userLocation = useLocation();

  // Handler for when a location item is pressed
  const handlePress = (location) => {
    let walkingDistance = "N/A";
    let duration = "N/A";
    if (userLocation) {
      // Calculate distance in kilometers using the Haversine formula.
      const distanceKm = haversineDistance(userLocation, location.coordinates);
      // Convert kilometers to miles.
      const distanceMiles = distanceKm * 0.621371;
      walkingDistance = `${distanceMiles.toFixed(2)} mi`;
      // Estimate time: assuming 20 minutes per mile.
      const timeMin = distanceMiles * 20;
      duration = `${Math.round(timeMin)} min`;
    }
    // Pass the destination data with the calculated details.
    handleLocationPress({
      title: location.title,
      address: location.address,
      coordinates: location.coordinates,
      walkingDistance,
      duration,
      rating: location.rating,
      connectedNode: location.connectedNode,
    });
  };

    return (
        <ScrollView>
            <View style={styles.shortcuts}>
                <TouchableOpacity onPress={() => handleLocationPress({ title: home.title, coordinates: home.coordinates })} style={styles.shortcut}>

                    <View style={styles.shortcut}>
                        <View style={styles.shortcutIcon}>
                            <FontAwesome5 name="home" size={24} color="#2d6a4f" />
                        </View>
                        <Text style={styles.shortcutText}>Home</Text>
                        <Text style={styles.shortcutSubtext}>731 N 35t...</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(work)} style={styles.shortcut}>
                    <View style={styles.shortcut}>
                        <View style={styles.shortcutIcon}>
                            <FontAwesome5 name="briefcase" size={24} color="#2d6a4f" />
                        </View>
                        <Text style={styles.shortcutText}>{work.title}</Text>
                        <Text style={styles.shortcutSubtext}>{work.address}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePress(school)} style={styles.shortcut}>
                    <View style={styles.shortcut}>
                        <View style={styles.shortcutIcon}>
                            <FontAwesome5 name="briefcase" size={24} color="#2d6a4f" />
                        </View>
                        <Text style={styles.shortcutText}>{school.title}</Text>
                        <Text style={styles.shortcutSubtext}>{school.address}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Suggestions Section */}
            <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                    <Text style={styles.recentHeaderText}>Suggestions</Text>
                </View>

                {locationData.map((location) => (
                    <LocationItem
                        key={location.id}
                        title={location.title}
                        address={location.address}
                        coordinates={location.coordinates}
                        connectedNode={location.connectedNode}
                        onPress={() => handlePress(location)}
                        />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    shortcuts: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-around',
        marginTop: 110,
    },
    shortcut: {
        alignItems: 'center',
    },
    shortcutIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#e8f0fe',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    shortcutText: {
        fontSize: 13,
        color: '#333',
    },
    shortcutSubtext: {
        fontSize: 12,
        color: '#666',
    },
    recentSection: {
        paddingHorizontal: 15,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        alignItems: 'center',
    },
    recentHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    separator: {
        height: 2,
        backgroundColor: '#ccc',
        marginVertical: 5,
        marginHorizontal: 15,
    },
});

export default SearchPage;
