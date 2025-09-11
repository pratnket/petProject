import React, {useRef, useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

interface GoogleMapsWebViewProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  onMapPress?: (latitude: number, longitude: number) => void;
  onMarkerPress?: (marker: any) => void;
  onLocationUpdate?: (latitude: number, longitude: number) => void;
  useCurrentLocation?: boolean;
  style?: any;
}

const {width, height} = Dimensions.get('window');

const GoogleMapsWebView: React.FC<GoogleMapsWebViewProps> = ({
  latitude = 25.0330,
  longitude = 121.5654,
  zoom = 15,
  markers = [],
  onMapPress,
  onMarkerPress,
  onLocationUpdate,
  useCurrentLocation = false,
  style,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({
    latitude,
    longitude,
  });

  // 獲取用戶當前位置
  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude: lat, longitude: lng} = position.coords;
        setCurrentLocation({latitude: lat, longitude: lng});
        setMapCenter({latitude: lat, longitude: lng});
        if (onLocationUpdate) {
          onLocationUpdate(lat, lng);
        }
      },
      (error) => {
        console.log('定位錯誤:', error);
        Alert.alert('定位失敗', '無法獲取您的位置，請檢查定位權限設定');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [onLocationUpdate]);

  // 當需要獲取當前位置時
  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation, getCurrentLocation]);

  const generateHTML = useCallback(() => {
    const centerLat = mapCenter.latitude;
    const centerLng = mapCenter.longitude;
    
    // 添加用戶位置標記
    const userLocationMarker = currentLocation
      ? `
        const userLocationMarker = new google.maps.Marker({
          position: { lat: ${currentLocation.latitude}, lng: ${currentLocation.longitude} },
          map: map,
          title: '您的位置',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23007bff"><circle cx="12" cy="12" r="8" fill="%23ffffff"/><circle cx="12" cy="12" r="4" fill="%23007bff"/></svg>'),
            scaledSize: new google.maps.Size(24, 24),
          }
        });
      `
      : '';

    const markersScript = markers
      .map(
        (marker, index) => `
        const marker${index} = new google.maps.Marker({
          position: { lat: ${marker.latitude}, lng: ${marker.longitude} },
          map: map,
          title: '${marker.title || ''}',
          ${marker.description ? `label: '${marker.description}'` : ''}
        });
        
        marker${index}.addListener('click', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPress',
            marker: {
              latitude: ${marker.latitude},
              longitude: ${marker.longitude},
              title: '${marker.title || ''}',
              description: '${marker.description || ''}'
            }
          }));
        });
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              font-family: Arial, sans-serif;
            }
            #map {
              height: 100%;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let currentMarker;
            
            function initMap() {
              map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${centerLat}, lng: ${centerLng} },
                zoom: ${zoom},
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                gestureHandling: 'greedy'
              });
              
              // 添加地圖點擊事件
              map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                
                // 移除之前的標記
                if (currentMarker) {
                  currentMarker.setMap(null);
                }
                
                // 添加新標記
                currentMarker = new google.maps.Marker({
                  position: { lat: lat, lng: lng },
                  map: map,
                  title: '選中的位置'
                });
                
                // 發送消息到 React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapPress',
                  latitude: lat,
                  longitude: lng
                }));
              });
              
              ${userLocationMarker}
              ${markersScript}
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUfOzu0BmU&callback=initMap">
          </script>
        </body>
      </html>
    `;
  }, [mapCenter, zoom, markers, currentLocation]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapPress' && onMapPress) {
        onMapPress(data.latitude, data.longitude);
      } else if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.marker);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [onMapPress, onMarkerPress]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{html: generateHTML()}}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  webview: {
    flex: 1,
  },
});

export default GoogleMapsWebView;
