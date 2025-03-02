import { LOCAL_IP, PORT } from "@env"
import React, { useRef, useEffect, useMemo, useState } from 'react';
import MapView, { UrlTile, Polygon, Polyline, Callout, Marker } from 'react-native-maps';
import { StyleSheet, Animated, View, Text } from 'react-native';
import geojsonData from './file1_1.json'; // Ensure the file is in the project
import dijkstraWithNodeWeights from '../hooks/useShortestPath';
import useLocation from '../hooks/useLocation';
import HistoricalCrimeDataPins from './HistoricalCrimeDataPins';
import CustomMarker from "./CustomMarker";
import AnimatedPolyline from "./AnimatedPolyLine";

// Animated marker component that shows a glowing red marker.
const AnimatedMarker = ({ alert }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // Loop a pulsing animation to create a glow effect.
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <Marker coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}>
      <View style={styles.markerContainer}>
        {/* Animated glowing halo */}
        <Animated.View style={[styles.glow, { transform: [{ scale: scaleAnim }] }]} />
        {/* Static center dot */}
        <View style={styles.centerMarker} />
      </View>
      <Callout>
        <Text style={styles.calloutText}>{alert.description}</Text>
      </Callout>
    </Marker>
  );
};

const MapComponent = ({ destination: destination, showCrimeData, showIntersections, showRoute }) => {
  const mapRef = useRef(null);
  const [selectedNeighbors, setSelectedNeighbors] = useState([]);
  const [receivedAlert, setRecievedAlert] = useState(false);
  const userLocation = useLocation();
  const startNode = 'node/8110066848';
//   const endNode = 'node/7835909883';
//   const [endNode, setEndNode] = useState('node/7835909883');
  const markerRef = useRef(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      if (destination?.coordinates) {
        console.log("Animating to destination:", destination.coordinates);
        mapRef.current.animateToRegion(
          {
            latitude: destination.coordinates.latitude,
            longitude: destination.coordinates.longitude,
            latitudeDelta: 0.005, // Adjust zoom level as needed
            longitudeDelta: 0.005,
          },
          500
        );
      } else if (userLocation) {
        console.log("Animating to user location:", userLocation);
        mapRef.current.animateToRegion(
          {
            ...userLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    }
  }, [destination, userLocation]);
  

  useEffect(() => {
    if (destination && markerRef.current) {
      // a short timeout to ensure the marker is fully rendered
      setTimeout(() => {
        markerRef.current.showCallout();
      }, 500);
    };
    
  }, [destination]);

  // Filter valid highway crossing features
  const crossingFeatures = useMemo(() => {
    return geojsonData.features.filter((feature) => {
      return (
        feature.properties?.highway === 'crossing' && // Ensure it's a crossing
        feature.geometry?.type === 'Point' && // Ensure it's a Point
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length === 2 &&
        typeof feature.geometry.coordinates[0] === 'number' &&
        typeof feature.geometry.coordinates[1] === 'number'
      );
    });
  }, []);

  useEffect(() => {
    const ip = LOCAL_IP || 'undefined';
    const port = PORT || 3000;
    console.log("LOCAL_IP:", ip);
    console.log("PORT:", port);
  
    const fetchAlerts = async () => {
      try {
        const apiUrl = `http://${ip}:${port}/alerts`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.alerts.length > 0 && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
  
          if (geojsonData) {
            const latestNodeId = data.alerts[0].nearestnode; // e.g., "node/8110066883"
            // Find the feature with the matching "@id"
            const matchingFeature = geojsonData.features.find(
              (feature) => feature.properties?.["@id"] === latestNodeId
            );
            if (matchingFeature) {
              matchingFeature.weight = data.alerts[0].nodeweight; 
              setRecievedAlert((prev) => !prev);
            } else {
              console.log("Matching feature not found for node:", latestNodeId);
            }
          }
        } else {
          console.log('No alerts data found');
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
  
    // Fetch alerts immediately when component mounts.
    fetchAlerts();
  
    // Poll every 1 seconds.
    const intervalId = setInterval(fetchAlerts, 1000);
  
    // Cleanup on unmount.
    return () => clearInterval(intervalId);
  }, []);
  const handlePolygonPress = (feature) => {
    console.log(feature.properties["@id"]);
    const neighbors = feature.neighbors || [];
    setSelectedNeighbors([...neighbors]);
  };

  const createCirclePolygon = (center, radius, numPoints = 30) => {
    const points = [];
    const degreeStep = 360 / numPoints;
    for (let i = 0; i < numPoints; i++) {
      const radians = (i * degreeStep * Math.PI) / 180;
      const latitudeOffset = radius * Math.cos(radians) / 111320;
      const longitudeOffset = (radius * Math.sin(radians)) / (111320 * Math.cos(center.latitude * (Math.PI / 180)));
      points.push({
        latitude: center.latitude + latitudeOffset,
        longitude: center.longitude + longitudeOffset,
      });
    }
    return points;
  };

  // algorithm
  const [pathCoordinates, setPathCoordinates] = useState([]);

  const parseGeoJSON = (geojsonData) => {
    const nodes = {};
    geojsonData.features.forEach((feature) => {
      const nodeId = feature.properties["@id"];
      if (feature.weight && feature.neighbors) {
        nodes[nodeId] = {
          weight: feature.weight,
          neighbors: feature.neighbors,
          coordinates: feature.geometry.coordinates,
        };
      }
    });
    return nodes;
  };

  useEffect(() => {
    // console.log("destination is outside: ", destination);
    if (destination?.connectedNode){
        // console.log("destination Node: ", destination.connectedNode);
        const nodes = parseGeoJSON(geojsonData);
        const shortestPath = dijkstraWithNodeWeights(nodes, startNode, destination.connectedNode);
    
        // Convert path to coordinates
        const coordinates = shortestPath.map((nodeId) => {
          const [longitude, latitude] = nodes[nodeId].coordinates;
          return { latitude, longitude };
        });
        setPathCoordinates(coordinates);
    }
  }, [destination, receivedAlert]);
  
  console.log(showRoute);
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        ...userLocation,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      showsUserLocation={true}
      followsUserLocation={false}
    >
      <UrlTile
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
      />

{showRoute && pathCoordinates.length > 0 && (
  <AnimatedPolyline pathCoordinates={pathCoordinates} />
)}



      {userLocation && (
        <Polygon
          coordinates={createCirclePolygon(userLocation, 50)}
          strokeWidth={1}
          strokeColor="blue"
          fillColor="rgba(0, 0, 255, 0.3)"
        />
      )}
      {showCrimeData && <HistoricalCrimeDataPins />}

      {showIntersections && crossingFeatures.map((feature, idx) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        const isNeighbor = selectedNeighbors.includes(feature.properties["@id"]);
        return (
            <React.Fragment key={`crossing-${idx}`}>

            <Polygon
              key={feature.id || idx}
              coordinates={createCirclePolygon({ latitude, longitude }, 20)}
              strokeWidth={1}
              strokeColor={isNeighbor ? "green" : "red"}
              fillColor={isNeighbor ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"}
              tappable={true}
              onPress={() => handlePolygonPress(feature)}
            />

            {feature.weight !== undefined && (
              <Marker coordinate={{ latitude, longitude }} key={`marker-${idx}`}>
                <CustomMarker weight={feature.weight} />
              </Marker>
            )}

          </React.Fragment>
        );
      })}
      {destination &&
        <Marker
          ref={markerRef}
          coordinate={destination.coordinates}
          pinColor="green"
        >
          <Callout tooltip>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle} numberOfLines={2}>
                {destination.title}
              </Text>
            </View>
          </Callout>
        </Marker>
      }
      {alerts.map(alert => (
        <AnimatedMarker key={alert.id} alert={alert} />
      ))}
    </MapView>

  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  calloutContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 8,
    width: 150,
    alignItems: 'left',
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,0,0,0.3)', // red with opacity for the glow
  },
  centerMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  calloutText: {
    width: 150,
    padding: 5,
  },
});

export default MapComponent;
