import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {ViewStyle} from 'react-native';

interface SimpleMapViewProps {
  style?: ViewStyle;
  latitude?: number;
  longitude?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
}

const SimpleMapView: React.FC<SimpleMapViewProps> = ({
  style,
  latitude = 25.0330,
  longitude = 121.5654,
  markers = [],
}) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={style || { flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
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
        />
      ))}
    </MapView>
  );
};

export default SimpleMapView;
