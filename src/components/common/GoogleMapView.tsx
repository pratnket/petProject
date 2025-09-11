import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {ViewStyle, Alert, Platform, PermissionsAndroid, Text, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface GoogleMapViewProps {
  style?: ViewStyle;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  onMapPress?: (event: any) => void;
  onMarkerPress?: (event: any) => void;
  onLocationUpdate?: (location: {latitude: number; longitude: number}) => void;
  useCurrentLocation?: boolean;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  style,
  latitude = 25.0330,
  longitude = 121.5654,
  zoom = 15,
  markers = [],
  onMapPress,
  onMarkerPress,
  onLocationUpdate,
  useCurrentLocation = false,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [region, setRegion] = useState({
    latitude: useCurrentLocation ? 25.0330 : latitude,
    longitude: useCurrentLocation ? 121.5654 : longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // 請求位置權限
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
            if (useCurrentLocation) {
              getCurrentLocation();
            }
          } else {
            console.log('位置權限請求被拒絕');
            setHasPermission(false);
          }
        } else {
          // iOS 不需要額外權限請求，直接嘗試獲取位置
          setHasPermission(true);
          if (useCurrentLocation) {
            getCurrentLocation();
          }
        }
      } catch (error) {
        console.error('位置權限請求失敗:', error);
        setHasPermission(false);
      }
    };

    if (useCurrentLocation) {
      requestLocationPermission();
    }
  }, [useCurrentLocation]);

  // 獲取當前位置
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        onLocationUpdate?.(location);
      },
      (error) => {
        console.error('獲取位置失敗:', error);
        Alert.alert('位置錯誤', '無法獲取您的位置');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // 處理地圖點擊
  const handleMapPress = (event: any) => {
    onMapPress?.(event);
  };

  // 處理標記點擊
  const handleMarkerPress = (marker: any) => {
    onMarkerPress?.(marker);
  };

  try {
    return (
      <MapView
        style={style || { flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onPress={handleMapPress}
        showsUserLocation={useCurrentLocation && hasPermission}
        showsMyLocationButton={useCurrentLocation && hasPermission}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
        mapType="standard"
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        {/* 顯示所有標記 */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        
        {/* 顯示當前位置標記（如果沒有使用 showsUserLocation） */}
        {useCurrentLocation && currentLocation && !hasPermission && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="您的位置"
            pinColor="blue"
          />
        )}
      </MapView>
    );
  } catch (error) {
    console.error('地圖載入失敗:', error);
    return (
      <View style={[style || { flex: 1 }, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>地圖載入失敗</Text>
      </View>
    );
  }
};

export default GoogleMapView;