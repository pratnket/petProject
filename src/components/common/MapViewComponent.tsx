import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import GoogleMapView from './GoogleMapView';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPressMarker?: () => void;
};

const MapViewComponent: React.FC<Props> = ({containerStyle}) => {
  return (
    <View style={[styles.mapContainer, containerStyle]}>
      <GoogleMapView style={styles.mapView} />
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
