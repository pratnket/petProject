import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet} from 'react-native';

interface AppleMapViewProps {
  latitude?: number;
  longitude?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  onMarkerPress?: (marker: any) => void;
  style?: any;
}

const AppleMapView: React.FC<AppleMapViewProps> = ({
  latitude = 25.0330,
  longitude = 121.5654,
  markers = [],
  zoomEnabled = true,
  scrollEnabled = true,
  showsUserLocation = false,
  showsMyLocationButton = false,
  onMarkerPress,
  style,
}) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={style || styles.map}
      initialRegion={region}
      zoomEnabled={zoomEnabled}
      scrollEnabled={scrollEnabled}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsMyLocationButton}
      showsCompass={true}
      showsScale={true}
      showsBuildings={true}
      showsTraffic={false}
      showsIndoors={true}
      mapType="standard"
      pitchEnabled={true}
      rotateEnabled={true}
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
          onPress={() => onMarkerPress?.(marker)}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default AppleMapView;
