import { useEffect, useState } from 'react';
import { reverseGeocode } from '../../utils/reverseGeocode';

interface Location {
  latitude: number;
  longitude: number;
}


const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('瀏覽器不支援地理位置功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        const city = await reverseGeocode(latitude, longitude);
        setAddress(city);
      },
      err => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, address, error };
};

export default useCurrentLocation;
