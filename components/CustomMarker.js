import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomMarker = ({ weight }) => (
  <View style={styles.markerContainer}>
    <Text style={styles.markerText}>{weight}</Text>
  </View>
);

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  markerText: {
    color: 'black',
    fontSize: 12,
  },
});

export default CustomMarker;
