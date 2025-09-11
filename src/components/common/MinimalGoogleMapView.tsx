import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet} from 'react-native';

const MinimalGoogleMapView: React.FC = () => {
  const region = {
    latitude: 25.0330,
    longitude: 121.5654,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MinimalGoogleMapView;
