import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {ViewStyle, Alert, Platform, PermissionsAndroid, View, Text, StyleSheet} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface UnifiedMapViewProps {
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
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'none' | 'mutedStandard';
}

const UnifiedMapView: React.FC<UnifiedMapViewProps> = ({
  style,
  latitude = 25.0330,
  longitude = 121.5654,
  zoom = 15,
  markers = [],
  onMapPress,
  onMarkerPress,
  onLocationUpdate,
  useCurrentLocation = false,
  mapType = 'standard',
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapError, setMapError] = useState(false);

  const region = {
    latitude,
    longitude,
    latitudeDelta: zoom / 1000,
    longitudeDelta: zoom / 1000,
  };

  // 請求位置權限
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '位置權限',
              message: '此應用程式需要存取您的位置以顯示附近的地圖和服務',
              buttonNeutral: '稍後詢問',
              buttonNegative: '取消',
              buttonPositive: '確定',
            }
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          // iOS
          const granted = await Geolocation.requestAuthorization('whenInUse');
          setHasPermission(granted === 'granted');
        }

        if (useCurrentLocation) {
          getCurrentLocation();
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
    const {latitude, longitude} = event.nativeEvent.coordinate;
    onMapPress?.({latitude, longitude});
  };

  // 處理標記點擊
  const handleMarkerPress = (marker: any) => {
    onMarkerPress?.(marker);
  };

  // 如果地圖載入錯誤，顯示錯誤訊息
  if (mapError) {
    return (
      <View style={[styles.errorContainer, style]}>
        <Text style={styles.errorText}>地圖載入失敗</Text>
        <Text style={styles.errorSubText}>請檢查網路連接</Text>
      </View>
    );
  }

  return (
    <MapView
      style={style || styles.map}
      // 跨平台提供者策略：iOS 使用 Apple Maps，Android 使用 Google Maps
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={region}
      onPress={handleMapPress}
      showsUserLocation={useCurrentLocation && hasPermission}
      showsMyLocationButton={useCurrentLocation && hasPermission}
      showsCompass={true}
      showsScale={true}
      showsBuildings={true}
      showsTraffic={false}
      showsIndoors={true}
      mapType={mapType}
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
      loadingEnabled={true}
      loadingIndicatorColor="#666666"
      loadingBackgroundColor="#eeeeee"
      onMapReady={() => {
        console.log(`${Platform.OS} Map is ready`);
      }}
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
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#999',
  },
});

export default UnifiedMapView;
