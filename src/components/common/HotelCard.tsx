import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from '../PlatformIcon';
import ImageAssets from '../../constants/ImageAssets';
import {getImageSource} from '../../utils/getImageSource';

interface HotelCardProps {
  imageUrl: string;
  title: string;
  distance: string;
  rating: number;
  likes: number;
  price: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  imageUrl,
  title,
  distance,
  rating,
  likes,
  price,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <TouchableOpacity style={styles.card}>
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
            source={
              typeof imageUrl === 'number'
                ? imageUrl // ✅ require 傳回的是 number
                : {uri: imageUrl} // ✅ 網址的情況
            }
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
