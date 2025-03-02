import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { FontAwesome5 } from '@expo/vector-icons';


const RoutePopUp = ({ destination, setShowRoute, setIsSearchPage }) => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => (destination ? ['15%', '40%'] : ['60%']), [destination]);

  const handleSheetChanges = useCallback((index) => {
    console.log('Bottom sheet changed to index:', index);
  }, []);

  useEffect(() => {
    setShowRoute(false);
  }
  , [destination]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        index={destination ? 1 : 0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.dragIndicator} />
          {destination ? (
            <View style={styles.contentContainer}>
              <Text style={styles.sheetTitle}>{destination.title}</Text>
              <Text style={styles.sheetAddress}>{destination.address}</Text>
              {destination.rating && (
                <View style={styles.infoRow}>
                  <FontAwesome5 name="star" size={16} color="gold" style={styles.iconSpacing} />
                  <Text style={styles.ratingText}>{destination.rating}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <FontAwesome5 name="walking" size={16} color="#444" style={styles.iconSpacing} />
                <Text style={styles.infoLabel}>Distance:</Text>
                <Text style={styles.infoValue}>{destination.walkingDistance}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="clock" size={16} color="#444" style={styles.iconSpacing} />
                <Text style={styles.infoLabel}>Estimated Time:</Text>
                <Text style={styles.infoValue}>{destination.duration}</Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  console.log("SafeRoute set to true in popUp");
                  setShowRoute(true);
                }}              >
                <Text style={styles.startButtonText}>Find Safe Path !</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="compass" size={36} color="#2d6a4f" style={{ marginBottom: 12 }} />
              <Text style={styles.sheetTitle}>Welcome to Safe Glow</Text>
              <Text style={styles.sheetSubtitle}>
                Search for a destination to begin your safe journey.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setIsSearchPage(true)}
              >
                <Text style={styles.startButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
  },
  contentContainer: {
    width: '100%',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sheetAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
    width: 130,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 16,
    alignSelf: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoutePopUp;