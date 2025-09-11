import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import UnifiedMapView from '../components/common/UnifiedMapView';
import PageWrapper from '../components/safe-area/PageWrapper';

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

  return (
    <PageWrapper style={styles.container}>
      <View style={styles.container}>
        <View style={styles.mapHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← 返回</Text>
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
            description: hotel.address,
          }))}
          onMarkerPress={marker => {
            console.log('標記被點擊:', marker);
            // 可以在這裡添加標記點擊的處理邏輯
          }}
          onMapPress={location => {
            console.log('地圖被點擊:', location);
            // 可以在這裡添加地圖點擊的處理邏輯
          }}
          useCurrentLocation={false}
          mapType="standard"
          />
      </View>
    </PageWrapper>
  );
};

export default NearbyHotelMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
