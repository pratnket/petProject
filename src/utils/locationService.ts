import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  success: boolean;
  coordinates?: LocationCoordinates;
  error?: string;
}

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
}

class LocationService {
  // 請求位置權限
  async requestLocationPermission(): Promise<LocationPermissionResult> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '位置權限請求',
            message: '此應用需要存取您的位置以提供附近區域搜尋功能',
            buttonNeutral: '稍後詢問',
            buttonNegative: '拒絕',
            buttonPositive: '允許',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return {granted: true};
        } else {
          return {granted: false, error: '位置權限被拒絕'};
        }
      } else {
        // iOS 會在第一次調用 getCurrentPosition 時自動請求權限
        return {granted: true};
      }
    } catch (error) {
      console.error('請求位置權限失敗:', error);
      return {granted: false, error: '請求權限時發生錯誤'};
    }
  }

  // 獲取當前位置
  async getCurrentLocation(): Promise<LocationResult> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          success: false,
          error: '獲取位置超時',
        });
      }, 15000);

      Geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve({
            success: true,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('獲取位置失敗:', error);
          
          let errorMessage = '無法獲取您的位置';
          switch (error.code) {
            case 1:
              errorMessage = '位置權限被拒絕，請在設定中開啟位置服務';
              break;
            case 2:
              errorMessage = '位置服務不可用';
              break;
            case 3:
              errorMessage = '獲取位置超時';
              break;
            default:
              errorMessage = '獲取位置時發生未知錯誤';
              break;
          }

          resolve({
            success: false,
            error: errorMessage,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }

  // 獲取附近區域（帶權限檢查）
  async getNearbyLocation(): Promise<LocationResult> {
    try {
      // 首先請求權限
      const permissionResult = await this.requestLocationPermission();
      
      if (!permissionResult.granted) {
        return {
          success: false,
          error: permissionResult.error || '需要位置權限才能使用附近區域功能',
        };
      }

      // 獲取當前位置
      const locationResult = await this.getCurrentLocation();
      
      if (!locationResult.success) {
        // 顯示用戶友好的錯誤提示
        Alert.alert(
          '位置獲取失敗',
          locationResult.error || '無法獲取您的位置，請檢查位置服務是否開啟',
          [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '前往設定',
              onPress: () => {
                // 這裡可以引導用戶到設定頁面
                console.log('引導用戶到設定頁面');
              },
            },
          ],
        );
      }

      return locationResult;
    } catch (error) {
      console.error('獲取附近區域失敗:', error);
      return {
        success: false,
        error: '獲取附近區域時發生錯誤',
      };
    }
  }

  // 反向地理編碼（座標轉地址）
  async reverseGeocode(coordinates: LocationCoordinates): Promise<string> {
    try {
      // 這裡可以接入地圖服務的反向地理編碼 API
      // 暫時返回座標格式的地址
      return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
    } catch (error) {
      console.error('反向地理編碼失敗:', error);
      return '未知位置';
    }
  }

  // 計算兩點之間的距離（公里）
  calculateDistance(
    point1: LocationCoordinates,
    point2: LocationCoordinates,
  ): number {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) *
        Math.cos(this.deg2rad(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // 格式化距離顯示
  formatDistance(distanceInKm: number): string {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)}m`;
    } else {
      return `${distanceInKm.toFixed(1)}km`;
    }
  }

  // 檢查位置服務是否可用
  async checkLocationServicesEnabled(): Promise<boolean> {
    try {
      // 這裡可以檢查位置服務是否開啟
      // 暫時返回 true，實際實作可能需要原生模組
      return true;
    } catch (error) {
      console.error('檢查位置服務失敗:', error);
      return false;
    }
  }
}

// 導出單例
export const locationService = new LocationService();
export default locationService;
