import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {playClickSound} from '../utils/soundPlayer';
import UnifiedMapView from '../components/common/UnifiedMapView';

type Hotel = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: string;
  images: string[];
  description: string[];
  title: string;
  distance: string;
  rating: number;
  likes: number;
  address: string;
};

const hotels: Hotel[] = [
  {
    id: '1',
    name: '寵曖貓狗生活館',
    lat: 24.14318483364294,
    lng: 120.67568228601196,
    description: [
      '不指定雙人房房型 / 本方案不分房型，實際入住以現場安排為主。',
      '1 張雙人床。',
      '坪數：6 坪。',
      '住房不含早餐；不含車位。',
      '禁止攜帶寵物。',
      '全館禁菸。',
      '房內設施：乾溼分離。',
      '公共設施：無線網路。',
      '最晚退房時間：中午 11:00。',
    ],
    images: [
      'http://192.168.213.10:8080/assets/mockData/test.png',
      'http://192.168.213.10:8080/assets/mockData/002.webp',
      'http://192.168.213.10:8080/assets/mockData/003.webp',
      'http://192.168.213.10:8080/assets/mockData/004.webp',
    ],
    title: '測試旅館 9 號',
    distance: '389m',
    rating: 5,
    likes: 5.0,
    price: 'TWD 1,000',
    address: '台中市南屯區東興路265號',
  },
  // 更多 mock 商家
  {
    id: '2',
    name: '毛五木寵物計畫',
    lat: 24.15249580222191,
    lng: 120.66869592833943,
    description: [
      '毛五木寵物計畫 中山館位於中山區。',
      '強調提供實惠超值的住宿品質予國內外商務旅客',
      '使您回到家般的自在。',
      '便利的商務功能與舒適乾淨的住宿環境為我們的主要服務核心',
    ],
    images: [
      'http://192.168.213.10:8080/assets/mockData/001.webp',
      'http://192.168.213.10:8080/assets/mockData/002.webp',
      'http://192.168.213.10:8080/assets/mockData/003.webp',
      'http://192.168.213.10:8080/assets/mockData/004.webp',
    ],
    title: '測試旅館 9 號',
    distance: '389m',
    rating: 5,
    likes: 5.0,
    price: 'TWD 12,000',
    address: '台中市南屯區東興路265號',
  },
];

const NearbyHotelMapScreen = () => {
  // Use 'any' to bypass type error, or define a proper type for your navigator
  const navigation = useNavigation<any>();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const title = selectedHotel ? selectedHotel.name : '附近旅館';

  const plans = [
    {label: title + '2h套餐', price: 1200},
    {label: title + '4h套餐', price: 1400},
    {label: title + '6h套餐', price: 1600},
    {label: title + '8h套餐', price: 1800},
    {label: title + '10h套餐', price: 2000},
    {label: title + '12h套餐', price: 2200},
    {label: title + '14h套餐', price: 2400},
    {label: title + '16h套餐', price: 2600},
    {label: title + '18h套餐', price: 2800},
    {label: title + '20h套餐', price: 3000},
  ];

  // 將旅館數據轉換為地圖標記
  const mapMarkers = hotels.map(hotel => ({
    latitude: hotel.lat,
    longitude: hotel.lng,
    title: hotel.name,
    description: hotel.address,
  }));

  const handleMapPress = (latitude: number, longitude: number) => {
    console.log('地圖點擊:', latitude, longitude);
  };

  const handleMarkerPress = (marker: any) => {
    console.log('標記點擊:', marker);
  };

  const handleLocationUpdate = (latitude: number, longitude: number) => {
    setUserLocation({latitude, longitude});
    console.log('用戶位置更新:', latitude, longitude);
  };

  if (showMap) {
    return (
      <View style={{flex: 1}}>
        <View style={styles.mapHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowMap(false)}>
            <Text style={styles.backButtonText}>← 返回列表</Text>
          </TouchableOpacity>
          <Text style={styles.mapTitle}>地圖檢視</Text>
        </View>
                       <UnifiedMapView 
                         latitude={24.14318483364294}
                         longitude={120.67568228601196}
                         zoom={15}
                         markers={hotels.map(hotel => ({
                           latitude: hotel.lat,
                           longitude: hotel.lng,
                           title: hotel.name,
                           description: hotel.address
                         }))}
                         onMarkerPress={(marker) => {
                           console.log('標記被點擊:', marker);
                           // 可以在這裡添加標記點擊的處理邏輯
                         }}
                         onMapPress={(location) => {
                           console.log('地圖被點擊:', location);
                           // 可以在這裡添加地圖點擊的處理邏輯
                         }}
                         useCurrentLocation={false}
                         mapType="standard"
                       />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.title}>附近旅館</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowMap(true)}>
          <Text style={styles.mapButtonText}>地圖檢視</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {hotels.map(hotel => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => {
              playClickSound(); // ✅ 播放音效
              navigation.navigate('HotelDetailScreen', {
                hotel: hotel,
                plans,
              });
            }}>
            <Image
              source={{uri: hotel.images[0]}}
              style={styles.hotelImage}
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelAddress}>{hotel.address}</Text>
              <Text style={styles.hotelDesc} numberOfLines={2}>
                {hotel.description.slice(0, 2).join(' ')}...
              </Text>
              <View style={styles.hotelFooter}>
                <Text style={styles.hotelPrice}>{hotel.price}</Text>
                <Text style={styles.hotelDistance}>{hotel.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default NearbyHotelMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  hotelCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  hotelImage: {
    width: 120,
    height: 120,
  },
  hotelInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hotelAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  hotelDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginTop: 8,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  hotelDistance: {
    fontSize: 12,
    color: '#666',
  },
});
