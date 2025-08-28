import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {playClickSound} from '../utils/soundPlayer';

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

  return (
    <View style={{flex: 1}}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: hotels[0].lat,
          longitude: hotels[0].lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {hotels.map(hotel => (
          <Marker
            key={hotel.id}
            coordinate={{latitude: hotel.lat, longitude: hotel.lng}}
            onPress={() => {
              playClickSound(); // ✅ 播放音效
              setSelectedHotel(hotel);
            }}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{hotel.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ✅ 底部資訊卡片 */}
      {selectedHotel && (
        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => {
            navigation.navigate('HotelDetailScreen', {
              hotel: selectedHotel,
              plans,
            });
          }}>
          <Image
            source={{uri: selectedHotel.images[0]}}
            style={styles.hotelImage}
          />
          <View style={{flex: 1, paddingLeft: 12}}>
            <Text style={styles.hotelName}>{selectedHotel.name}</Text>

            {/* 限制只顯示前 2 行說明 */}
            <Text style={styles.hotelDesc} numberOfLines={3}>
              {selectedHotel.description.slice(0, 2).join(' ')}...
            </Text>

            <Text style={styles.hotelPrice}>{selectedHotel.price}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NearbyHotelMapScreen;

const styles = StyleSheet.create({
  priceTag: {
    backgroundColor: '#0066ff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  hotelImage: {
    width: 100,
    height: 100,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hotelDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginTop: 4,
  },
  hotelPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
});
