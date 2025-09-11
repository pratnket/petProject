import React, {useState, useEffect} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, View, Text} from 'react-native';

interface SafeGoogleMapViewProps {
  latitude?: number;
  longitude?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
}

const SafeGoogleMapView: React.FC<SafeGoogleMapViewProps> = ({
  latitude = 25.0330,
  longitude = 121.5654,
  markers = [],
}) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    // 設置載入完成
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 如果地圖載入錯誤，顯示錯誤訊息
  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>地圖載入失敗</Text>
        <Text style={styles.errorSubText}>請檢查網路連接</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass={false}
      showsScale={false}
      showsBuildings={false}
      showsTraffic={false}
      showsIndoors={false}
      mapType="standard"
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={false}
      rotateEnabled={false}
      loadingEnabled={true}
      loadingIndicatorColor="#666666"
      loadingBackgroundColor="#eeeeee"
      onMapReady={() => {
        console.log('Google Map is ready');
        setIsLoading(false);
      }}
    >
      {/* 顯示標記 */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={marker.description}
        />
      ))}
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

export default SafeGoogleMapView;
