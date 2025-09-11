import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, Platform} from 'react-native';
import GoogleMapView from './GoogleMapView';
import AppleMapView from './AppleMapView';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPressMarker?: () => void;
};

const MapViewComponent: React.FC<Props> = ({
  lat,
  lng,
  title,
  description,
  containerStyle,
  onPressMarker,
}) => {
  const markers = [{
    latitude: lat,
    longitude: lng,
    title: title || '位置',
    description: description || '',
  }];

  return (
    <View style={[styles.mapContainer, containerStyle]}>
      {Platform.OS === 'ios' ? (
        <AppleMapView 
          style={styles.mapView}
          latitude={lat}
          longitude={lng}
          markers={markers}
          onMarkerPress={onPressMarker}
        />
      ) : (
        <GoogleMapView 
          style={styles.mapView}
          latitude={lat}
          longitude={lng}
          markers={markers}
          onMarkerPress={onPressMarker}
        />
      )}
    </View>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapView: {
    flex: 1,
  },
});
