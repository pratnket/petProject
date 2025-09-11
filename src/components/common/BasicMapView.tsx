import React from 'react';
import MapView from 'react-native-maps';
import {StyleSheet} from 'react-native';

const BasicMapView: React.FC = () => {
  const region = {
    latitude: 25.0330,
    longitude: 121.5654,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      showsUserLocation={false}
      showsMyLocationButton={false}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default BasicMapView;
