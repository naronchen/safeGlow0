import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Polyline } from 'react-native-maps';


const AnimatedPolyline = ({ pathCoordinates }) => {
    const glowOpacity = useRef(new Animated.Value(0.3)).current;
  
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, [glowOpacity]);
  
    return (
      <>
        {/* Outer glow */}
        <Polyline
          coordinates={pathCoordinates}
          strokeColor={`rgba(173, 255, 47, ${glowOpacity})`} // Light green-yellow with animated opacity
          strokeWidth={13}
        />
        {/* Middle glow */}
        <Polyline
          coordinates={pathCoordinates}
          strokeColor="rgba(34, 139, 34, 0.5)" // Medium forest green with transparency
          strokeWidth={9}
        />
        {/* Inner line */}
        <Polyline
          coordinates={pathCoordinates}
          strokeColor="#388e3c" // Solid dark green
          strokeWidth={5}
        />
      </>
    );
  };
  
  
  export default AnimatedPolyline;