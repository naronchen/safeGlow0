import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import crimeData from '../data/CrimeData.json';

const HistoricalCrimeDataPins = () => {
  // Function to determine the color of the marker based on the crime category
  const getMarkerColor = (crimeCategory) => {
    switch (crimeCategory) {
      case 'Shooting':
        return 'red';
      case 'Property Crime':
        return 'yellow';
      case 'Robbery/Gun':
        return 'red';
      case 'Rape':
        return 'purple';
      case 'Aggravated Assault':
        return 'red';
      default:
        return 'yellow';
    }
  };

  return (
        <>
        {crimeData && crimeData.map((crime, index) => {
        if (!crime.coordinates || crime.coordinates.latitude === undefined || crime.coordinates.longitude === undefined) {
            // Skip rendering this marker if coordinates are missing
            return null;
        }
        return (
            <Marker
            key={index}
            coordinate={{
                latitude: crime.coordinates.latitude,
                longitude: crime.coordinates.longitude,
            }}
            pinColor={getMarkerColor(crime.crimeCategory)}
            >
            <Callout tooltip>
                <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{crime.crimeCategory}</Text>
                <Text style={styles.calloutDescription}>{crime.crimeDescription}</Text>
                <Text style={styles.calloutDate}>{crime.date}</Text>
                </View>
            </Callout>
            </Marker>
        );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    width: 200,
    alignItems: 'left',
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
  },
  calloutDescription: {
    fontSize: 12,
    marginBottom: 5,
    color: 'black',
  },
  calloutDate: {
    fontSize: 10,
    color: 'gray',
    textAlign: 'right',
  },
});

export default HistoricalCrimeDataPins;