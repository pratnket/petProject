// hooks/useCurrentLocation.ts
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { reverseGeocode } from '../utils/reverseGeocode';

interface Location {
  latitude: number;
  longitude: number;
}

const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowSettings, setShouldShowSettings] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      const onSuccess = async (pos: { coords: { latitude: number; longitude: number } }) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        if (Platform.OS === 'web') {
          const addr = await reverseGeocode(latitude, longitude);
          setAddress(addr);
        }
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

          if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            setError('您已永久拒絕定位權限，請前往設定手動開啟');
            setShouldShowSettings(true);
            return;
          }

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

  return {
    location,
    address,
    error,
    openSettings: () => {
      Linking.openSettings().catch(() => {
        Alert.alert('無法開啟設定頁');
      });
    },
    shouldShowSettings,
  };
};

export default useCurrentLocation;
