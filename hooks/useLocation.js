import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
    const pennTennis =
    {
        latitude: 39.95638288500491,
        longitude: -75.19017053961221,
    };
  const [location, setLocation] = useState(pennTennis);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  return location;
};

export default useLocation;
