import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import ImageAssets from '../../constants/ImageAssets';
import {getImageSource} from '../../utils/getImageSource';
import GoogleMapView from './GoogleMapView';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPressMarker?: () => void;
  userLocation?: {latitude: number; longitude: number} | null;
  showMap?: boolean;
  onMapPress?: (latitude: number, longitude: number) => void;
  useCurrentLocation?: boolean;
};

// Pulse 動畫 Marker（外層絕對定位）
const PulseOverlay = ({lat, lng}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 2.5,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [scale, opacity]);

  // 這裡需要將經緯度轉成螢幕座標，這裡假設地圖中心就是 marker 位置
  // 實務上可用 onRegionChange 或 mapRef.pointForCoordinate 取得精確座標
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulse,
        {
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: -18, // pulse 寬度一半
          marginTop: -36, // 根據 marker 圖片與 pulse 高度微調
          transform: [{scale}],
          opacity,
        },
      ]}
    />
  );
};

const MapViewComponent: React.FC<Props> = ({
  lat,
  lng,
  title,
  description,
  containerStyle,
  onPressMarker,
  showMap = false,
  onMapPress,
  useCurrentLocation = false,
}) => {
  const [isMapVisible, setIsMapVisible] = useState(showMap);

  const handleMapPress = (latitude: number, longitude: number) => {
    if (onMapPress) {
      onMapPress(latitude, longitude);
    }
  };

  if (isMapVisible) {
    return (
      <View style={[styles.mapContainer, containerStyle]}>
             <GoogleMapView
               style={styles.mapView}
             />
        <TouchableOpacity
          style={styles.closeMapButton}
          onPress={() => setIsMapVisible(false)}>
          <Text style={styles.closeMapButtonText}>關閉地圖</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Image
            source={getImageSource(ImageAssets.map)}
            style={styles.markerIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.locationInfo}>
          {title && <Text style={styles.locationTitle}>{title}</Text>}
          {description && <Text style={styles.locationDescription}>{description}</Text>}
          <Text style={styles.coordinates}>
            經度: {lng.toFixed(6)}, 緯度: {lat.toFixed(6)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {onPressMarker && (
            <TouchableOpacity onPress={onPressMarker} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>查看</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setIsMapVisible(true)}
            style={styles.mapButton}>
            <Text style={styles.mapButtonText}>地圖</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  container: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapView: {
    flex: 1,
  },
  closeMapButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeMapButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  locationCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  markerIcon: {
    width: 24,
    height: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  mapButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
