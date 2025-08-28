import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../PlatformIcon';
import ImageAssets from '../../constants/ImageAssets';
import {getImageSource} from '../../utils/getImageSource';

interface HotelCardProps {
  imageUrl: string;
  coverImage: string;
  title: string;
  distance: string;
  rating: number;
  likes: number;
  price: string;
  lat: number;
  lng: number;
  address: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  imageUrl,
  coverImage,
  title,
  distance,
  rating,
  likes,
  price,
  lat,
  lng,
  address,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const nativeNavigation = useNavigation();

  const handlePress = () => {
    const hotelData = {
      images: [imageUrl, imageUrl, imageUrl, imageUrl], // 輪播圖
      coverImage: coverImage, // ✅ 新增封面圖專用欄位
      name: title,
      lat: lat,
      lng: lng,
      address: address,
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
      review:
        '今天帶我家寶貝來洗澡及安親，寶貝玩得很開心，服務人員小姐姐們都很親切，可以放心讓寶貝在這邊入住，太棒了👏👏👏',
      reviewCount: 288,
    };

    const hourList = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const plans = hourList.map(hour => ({
      label: `${title}${hour}h套餐`,
      price: 1000 + hour * 100, // 你原本的價格邏輯
      hour,
    }));

    nativeNavigation.navigate('HotelDetailScreen', {hotel: hotelData, plans});
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        {loading && !error && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            size="small"
            color="#999"
          />
        )}
        {error ? (
          <Image
            source={getImageSource(ImageAssets.error)}
            style={styles.image}
          />
        ) : (
          <Image
            source={typeof imageUrl === 'number' ? imageUrl : {uri: imageUrl}}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        )}

        <View style={styles.distanceOverlay}>
          <Icon name="location-outline" size={16} color="#fff" />
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.ratingRow}>
          {Array.from({length: 5}).map((_, i) => (
            <Icon
              key={i}
              name={i < rating ? 'star' : 'star-outline'}
              size={16}
              color="#FFB800"
            />
          ))}
        </View>
        <View style={styles.likesRow}>
          <Icon name="thumbs-up-outline" size={18} color="#6495ED" />
          <Text style={styles.likesText}>{likes.toFixed(1)}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  distanceOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  likesText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#000',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6495ED',
  },
});

export default HotelCard;
