import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import useLocation from './hooks/useLocation';
import SearchBarComponent from './components/SearchBarComponent';
import MapComponent from './components/MapComponent';
import SearchPage from './pages/SearchPage';
import RouterPopUp from './components/RoutePopUp';
import ToggleButton from './components/ToggleButton';

export default function App() {
  const [search, setSearch] = useState('');
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [destination, setDestination] = useState(null);
  const [showCrimeData, setShowCrimeData] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);

  const [showRoute, setShowRoute] = useState(false);


  const handleLocationPress = (destinationInfo) => {
    setDestination(destinationInfo);
    setIsSearchPage(false);
    // Use destinationInfo directly to update the search text
    setSearch(destinationInfo.title);
    console.log("search is: " + search)
  };

  const handleClearDestination = () => {
    setDestination(null);
  };

  const toggleCrimeData = () => {
    setShowCrimeData((prev) => !prev);
  };

  const toggleIntersections = () => {
    setShowIntersections(!showIntersections);
  };

  return (
    <View style={styles.container}>
      <SearchBarComponent
        search={destination?.title ?? search}
        setSearch={setSearch}
        onFocusCallBack={() => setIsSearchPage(true)}
        onBlurCallBack={() => setIsSearchPage(false)}
        onDestinaionClear={handleClearDestination}
        isSearchPage={isSearchPage}
      />

      {isSearchPage ? (
        <SearchPage handleLocationPress={handleLocationPress} />
      ) : (
        <View style={{ flex: 1 }}>
          <MapComponent destination={destination} showCrimeData={showCrimeData} showIntersections={showIntersections} showRoute={showRoute}/>
          <View style={styles.toggleContainer}>
            <ToggleButton
              toggleCrimeData={toggleCrimeData}
              showCrimeData={showCrimeData}
              label="Crime Data"
            />
            <ToggleButton
              toggleCrimeData={toggleIntersections}
              showCrimeData={showIntersections}
              label="Intersections"
            />
          </View>
          <View style={styles.bottomContainer}>
            <RouterPopUp destination={destination} setShowRoute={setShowRoute} setIsSearchPage={setIsSearchPage}/>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    position: 'absolute',
    top: 130,
    right: 30,
    zIndex: 1001,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
});
