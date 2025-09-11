import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from '../components/PlatformIcon';
import ImageAssets from '../constants/ImageAssets';
import {getImageSource} from '../utils/getImageSource';
import MapViewComponent from '../components/common/MapViewComponent';
import DateSelector from '../components/common/DateSelector';
import TimePriceSelector from '../components/common/TimePriceSelector';
import dayjs from 'dayjs';
// 添加 PageWrapper 導入
import PageWrapper from '../components/safe-area/PageWrapper';
import HeaderWrapper from '../components/safe-area/HeaderWrapper';

// 錯誤邊界組件
class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(_error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('BookingScreen Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>載入預訂頁面時發生錯誤</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({hasError: false})}>
            <Text style={styles.retryText}>重試</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// ✅ 輕量距離函式（Haversine）
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 新增一個方法來包裝 slot 並加上 endtime
const getSlotWithEndtime = (slot, hour) => {
  if (!slot) {
    return null;
  }
  return {
    ...slot,
    endtime: dayjs(slot.selltime)
      .add(hour || 3, 'hour')
      .format('YYYY-MM-DD HH:mm:ss'),
  };
};

const BookingScreen = ({route, navigation}) => {
  const {hotel, plan} = route.params;
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceText, setDistanceText] = useState('');

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  );
  // 建立時間價格資料
  // 假資料：各日期的時段與價格
  const allTimeSlots = useMemo(
    () => ({
      '2025-08-07': [
        {
          selltime: '2025-08-07 09:00:00',
          price: 580,
          remain_count: 10,
        },
        {
          selltime: '2025-08-07 09:15:00',
          price: 580,
          remain_count: 9,
        },
        {
          selltime: '2025-08-07 09:30:00',
          price: 580,
          remain_count: 8,
        },
        {
          selltime: '2025-08-07 09:45:00',
          price: 580,
          remain_count: 7,
        },
        {
          selltime: '2025-08-07 10:00:00',
          price: 580,
          remain_count: 6,
        },
      ],
      '2025-08-08': [
        {
          selltime: '2025-08-08 09:30:00',
          price: 680,
          remain_count: 1,
        },
        {
          selltime: '2025-08-08 09:45:00',
          price: 680,
          remain_count: 2,
        },
        {
          selltime: '2025-08-08 10:00:00',
          price: 680,
          remain_count: 3,
        },
        {
          selltime: '2025-08-08 10:15:00',
          price: 680,
          remain_count: 4,
        },
        {
          selltime: '2025-08-08 10:30:00',
          price: 680,
          remain_count: 5,
        },
        {
          selltime: '2025-08-08 10:45:00',
          price: 680,
          remain_count: 6,
        },
        {
          selltime: '2025-08-08 11:00:00',
          price: 680,
          remain_count: 7,
        },
        {
          selltime: '2025-08-08 11:15:00',
          price: 680,
          remain_count: 8,
        },
        {
          selltime: '2025-08-08 11:30:00',
          price: 680,
          remain_count: 9,
        },
        {
          selltime: '2025-08-08 11:45:00',
          price: 680,
          remain_count: 9,
        },
        {
          selltime: '2025-08-08 12:00:00',
          price: 680,
          remain_count: 9,
        },
        {
          selltime: '2025-08-08 12:15:00',
          price: 680,
          remain_count: 9,
        },
        {
          selltime: '2025-08-08 12:30:00',
          price: 680,
          remain_count: 8,
        },
        {
          selltime: '2025-08-08 12:45:00',
          price: 680,
          remain_count: 7,
        },
        {
          selltime: '2025-08-08 13:00:00',
          price: 680,
          remain_count: 6,
        },
        {
          selltime: '2025-08-08 13:15:00',
          price: 680,
          remain_count: 5,
        },
        {
          selltime: '2025-08-08 13:30:00',
          price: 680,
          remain_count: 4,
        },
        {
          selltime: '2025-08-08 13:45:00',
          price: 680,
          remain_count: 3,
        },
        {
          selltime: '2025-08-08 14:00:00',
          price: 680,
          remain_count: 2,
        },
        {
          selltime: '2025-08-08 14:15:00',
          price: 680,
          remain_count: 1,
        },
      ],
      '2025-08-09': [
        {
          selltime: '2025-08-09 10:00:00',
          price: 880,
          remain_count: 1,
        },
        {
          selltime: '2025-08-09 10:15:00',
          price: 880,
          remain_count: 2,
        },
        {
          selltime: '2025-08-09 10:30:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 10:45:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 11:00:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 11:15:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 11:30:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 11:45:00',
          price: 880,
          remain_count: 4,
        },
        {
          selltime: '2025-08-09 12:00:00',
          price: 880,
          remain_count: 5,
        },
        {
          selltime: '2025-08-09 12:15:00',
          price: 880,
          remain_count: 6,
        },
        {
          selltime: '2025-08-09 12:30:00',
          price: 880,
          remain_count: 6,
        },
        {
          selltime: '2025-08-09 12:45:00',
          price: 880,
          remain_count: 6,
        },
        {
          selltime: '2025-08-09 13:00:00',
          price: 880,
          remain_count: 5,
        },
        {
          selltime: '2025-08-09 13:15:00',
          price: 880,
          remain_count: 4,
        },
        {
          selltime: '2025-08-09 13:30:00',
          price: 880,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 13:45:00',
          price: 1080,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 14:00:00',
          price: 1080,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 14:15:00',
          price: 1080,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 14:30:00',
          price: 1080,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 14:45:00',
          price: 1080,
          remain_count: 2,
        },
        {
          selltime: '2025-08-09 15:00:00',
          price: 1080,
          remain_count: 1,
        },
        {
          selltime: '2025-08-09 16:45:00',
          price: 1080,
          remain_count: 3,
        },
        {
          selltime: '2025-08-09 17:00:00',
          price: 1080,
          remain_count: 1,
        },
        {
          selltime: '2025-08-09 17:15:00',
          price: 1080,
          remain_count: 1,
        },
        {
          selltime: '2025-08-09 17:30:00',
          price: 1280,
          remain_count: 1,
        },
      ],
      '2025-08-10': [
        {
          selltime: '2025-08-10 09:00:00',
          price: 780,
          remain_count: 5,
        },
        {
          selltime: '2025-08-10 09:30:00',
          price: 780,
          remain_count: 3,
        },
        {
          selltime: '2025-08-10 10:00:00',
          price: 780,
          remain_count: 8,
        },
        {
          selltime: '2025-08-10 10:30:00',
          price: 780,
          remain_count: 2,
        },
        // 可以繼續添加更多時間段
      ],
    }),
    [],
  );

  const handlePress = () => {
    navigation.navigate('BookingFormScreen', {hotel, plan, selectedSlot});
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ✅ 啟動時請求權限 + 取得定位
  useEffect(() => {
    const requestLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('位置權限未允許');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        pos => {
          const {latitude, longitude} = pos.coords;
          console.log('📍 使用者位置:', latitude, longitude);
          setUserLocation({latitude, longitude});

          if (hotel.lat && hotel.lng) {
            const km = getDistanceInKm(
              latitude,
              longitude,
              hotel.lat,
              hotel.lng,
            ).toFixed(2);
            setDistanceText(`${km} 公里`);
          }
        },
        err => {
          console.warn('❌ 定位失敗', err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    requestLocation();
  }, [hotel.lat, hotel.lng]);

  // 在 useEffect 加入自動選擇第一個時段
  useEffect(() => {
    const slot = allTimeSlots[selectedDate]?.[0];
    if (slot) {
      setSelectedSlot(getSlotWithEndtime(slot, plan?.hour));
      setSelectedIndex(0);
    } else {
      // 如果選中的日期沒有時段，嘗試使用第一個可用的日期
      const availableDates = Object.keys(allTimeSlots);
      if (availableDates.length > 0) {
        const firstAvailableDate = availableDates[0];
        const firstSlot = allTimeSlots[firstAvailableDate]?.[0];
        if (firstSlot) {
          setSelectedDate(firstAvailableDate);
          setSelectedSlot(getSlotWithEndtime(firstSlot, plan?.hour));
          setSelectedIndex(0);
        }
      }
    }
  }, [selectedDate, plan?.hour, allTimeSlots]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hotel.address}`;
    console.log('🔗 開啟 Google 地圖:', url);
    Linking.openURL(url);
  };

  return (
    <PageWrapper pageType="booking">
      <ErrorBoundary>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* 🔙 返回按鈕 */}
          <HeaderWrapper pageType="booking" style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#555" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{hotel?.name || '未知旅館'}</Text>
          </HeaderWrapper>

          {/* 套餐卡片 */}
          <View style={styles.planCard}>
            {loading && !hasError && (
              <ActivityIndicator
                style={StyleSheet.absoluteFill}
                size="small"
                color="#999"
              />
            )}
            <Image
              source={
                hasError
                  ? getImageSource(ImageAssets.error)
                  : getImageSource(hotel.coverImage)
              }
              style={styles.image}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setHasError(true);
                setLoading(false);
              }}
            />
            <View style={styles.planText}>
              <Text style={styles.planLabel}>{plan.label}</Text>
              <Text style={styles.time}>
                開始
                {selectedSlot?.selltime
                  ? dayjs(selectedSlot?.selltime).format('MM月DD日 HH:mm')
                  : '—'}
              </Text>
              <Text style={styles.time}>
                結束
                {selectedSlot?.selltime
                  ? dayjs(selectedSlot?.selltime)
                      .add(plan?.hour, 'hour')
                      .format('MM月DD日 HH:mm')
                  : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>地址</Text>
            <Text>{hotel.address}</Text>

            {/* 地圖區塊 */}
            {hotel.lat && hotel.lng && (
              <MapViewComponent
                lat={hotel.lat}
                lng={hotel.lng}
                title={hotel.name}
                description={hotel.address}
                containerStyle={styles.mapContainer}
                onPressMarker={openInGoogleMaps} // ✅ 傳入點擊事件
              />
            )}

            {/* 距離顯示 */}
            {userLocation && distanceText && (
              <Text style={styles.distanceText}>
                與你相距：約 {distanceText}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>商品內容</Text>
            {hotel.description.map((line, idx) => (
              <Text key={idx}>• {line}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>選擇日期</Text>
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={date => {
                setSelectedDate(date);
                const slot = allTimeSlots[date]?.[0];
                setSelectedIndex(0);
                setSelectedSlot(getSlotWithEndtime(slot, plan?.hour));
              }}
              availableDates={Object.keys(allTimeSlots)} // ⬅️ 加入這一行
            />

            <TimePriceSelector
              selectedDate={selectedDate} // 例如 '2025-07-25'
              timeSlots={allTimeSlots} // 所有 7 日範圍時段 + 價格
              selectedIndex={selectedIndex} // 當前選中的時間索引
              onSelect={idx => {
                setSelectedIndex(idx);
                const slot = allTimeSlots[selectedDate]?.[idx];
                setSelectedSlot(getSlotWithEndtime(slot, plan?.hour));
              }}
            />
          </View>
          {/* 新增吸底結帳區塊 */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>結帳金額</Text>
              <Text style={styles.checkoutAmount}>
                TWD {selectedSlot?.price ?? '0'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handlePress}>
              <Text style={styles.checkoutButtonText}>立即預訂</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  header: {flexDirection: 'row', alignItems: 'center'},
  backButton: {padding: 4, marginRight: 8},
  headerTitle: {fontSize: 18, fontWeight: 'bold'},
  planCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {width: 80, height: 80, borderRadius: 12, marginRight: 12},
  planText: {flex: 1},
  planLabel: {fontSize: 16, fontWeight: 'bold', marginBottom: 6},
  time: {fontSize: 14, color: '#444'},
  section: {marginBottom: 16},
  label: {fontWeight: 'bold', marginBottom: 4, fontSize: 15},
  distanceText: {marginTop: 4, color: '#555'},
  mapContainer: {marginTop: 12, marginBottom: 8},
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  checkoutLabel: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  checkoutAmount: {
    color: '#FF6600',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
