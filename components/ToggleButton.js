import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';

const ToggleButton = ({ toggleCrimeData, showCrimeData, label }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          showCrimeData && styles.activeButton,
        ]}
        onPress={toggleCrimeData}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleButton: {
    width: 105,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey', 
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  activeButton: {
    backgroundColor: '#2d6a4f', // Darker green for active state
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ToggleButton;
