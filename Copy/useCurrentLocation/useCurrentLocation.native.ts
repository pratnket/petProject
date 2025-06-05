// src/hooks/useCurrentLocation/useCurrentLocation.native.ts
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface Location {
  latitude: number;
  longitude: number;
}

const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const onSuccess = (pos: { coords: { latitude: number; longitude: number } }) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      };

      const onError = (err: any) => {
        setError(err.message);
      };

      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          setError('瀏覽器不支援地理位置功能');
          return;
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('定位權限未授權');
            return;
          }

          Geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000,
          });
        } catch (e: any) {
          setError(e.message);
        }
      }
    };

    getLocation();
  }, []);

  return { location, error };
};

export default useCurrentLocation;