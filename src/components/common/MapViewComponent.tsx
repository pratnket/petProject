import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {darkStyle} from '../../constants/mapStyle';
import ImageAssets from '../../constants/ImageAssets';
import {getImageSource} from '../../utils/getImageSource';

type Props = {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPressMarker?: () => void;
  userLocation?: {latitude: number; longitude: number} | null;
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
  containerStyle,
  onPressMarker,
}) => {
  // 移除內部 userLocation 狀態與 useEffect

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 水波紋動畫 疊在地圖上方，預設顯示在地圖中心（即 marker 位置） */}
      <PulseOverlay lat={lat} lng={lng} />
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={darkStyle}
        showsUserLocation={true} // ✅ 顯示使用者位置
        followsUserLocation={true} // ✅ 地圖跟隨使用者（可選）
        showsMyLocationButton={false} // ✅ 隱藏右下角定位按鈕
        toolbarEnabled={false} // ✅ 禁止點擊 marker 彈出圖示選單
      >
        {/* 目的地 marker 只用 image 屬性 */}
        <Marker
          coordinate={{latitude: lat, longitude: lng}}
          image={getImageSource(ImageAssets.marker)}
        />
      </MapView>

      <TouchableOpacity onPress={onPressMarker} style={styles.markerWrap}>
        <View>
          <Image
            source={getImageSource(ImageAssets.map)}
            style={styles.markerIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  customMarker: {
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  markerIcon: {
    width: 36,
    height: 36,
  },
  pulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF9800',
  },
});
