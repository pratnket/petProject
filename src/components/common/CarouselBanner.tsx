import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Text,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
}

interface CarouselBannerProps {
  banners?: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: number;
  onBannerPress?: (banner: BannerItem) => void;
  showIndicators?: boolean;
}

const CarouselBanner: React.FC<CarouselBannerProps> = ({
  banners = [],
  autoPlay = true,
  autoPlayInterval = 3000,
  height = 200,
  onBannerPress,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // 預設廣告數據（如果 API 未載入）
  const defaultBanners: BannerItem[] = [
    {
      id: '1',
      imageUrl: 'https://picsum.photos/400/200?random=1',
      title: '新會員註冊領購物金200',
      linkUrl: 'https://example.com/register',
    },
    {
      id: '2',
      imageUrl: 'https://picsum.photos/400/200?random=2',
      title: '寵物旅館優惠活動',
      linkUrl: 'https://example.com/promotion',
    },
    {
      id: '3',
      imageUrl: 'https://picsum.photos/400/200?random=3',
      title: '專業寵物照護服務',
      linkUrl: 'https://example.com/service',
    },
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  // 自動輪播
  useEffect(() => {
    if (autoPlay && displayBanners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % displayBanners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, displayBanners.length]);

  // 手動滑動處理
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);

    // 重置自動輪播計時器
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (autoPlay && displayBanners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % displayBanners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, autoPlayInterval);
    }
  };

  // 點擊廣告處理
  const handleBannerPress = (banner: BannerItem) => {
    if (onBannerPress) {
      onBannerPress(banner);
    } else if (banner.linkUrl) {
      Linking.openURL(banner.linkUrl).catch(err =>
        console.error('無法打開連結:', err),
      );
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    console.warn('廣告圖片載入失敗');
  };

  if (displayBanners.length === 0) {
    return (
      <View style={[styles.container, {height}]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暫無廣告</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {height}]}>
      {loading && (
        <View style={[styles.loadingContainer, {height}]}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {displayBanners.map(banner => (
          <TouchableOpacity
            key={banner.id}
            style={styles.bannerItem}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={0.9}>
            <Image
              source={{uri: banner.imageUrl}}
              style={[styles.bannerImage, {height}]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="cover"
            />
            {banner.title && (
              <View style={styles.titleOverlay}>
                <Text style={styles.titleText}>{banner.title}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 指示點 */}
      {showIndicators && displayBanners.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {displayBanners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  bannerItem: {
    width: screenWidth,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CarouselBanner;
