import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: '嘿！歡迎',
    subtitle: '為毛孩找到最安心的旅宿空間，開啟愉快假期旅程 🐾',
    image: require('../assets/onboarding1.jpg'),
    buttonLabel: 'Next',
  },
  {
    key: '2',
    title: '秒速預訂',
    subtitle: '快速預約寵物旅館、寄養照護、洗澡美容與到府照顧 🛁',
    image: require('../assets/onboarding2.jpg'),
    buttonLabel: 'Next',
  },
  {
    key: '3',
    title: '讓我們開始吧',
    subtitle: '24 小時毛孩位置與健康追蹤 📍\n即時飲食、活動與照片更新 📸',
    image: require('../assets/onboarding3.jpg'),
    buttonLabel: 'Get Started',
  },
];

const OnboardingScreen = ({onFinish}: {onFinish: () => void}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      onFinish();
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      keyExtractor={item => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <ImageBackground source={item.image} style={styles.slide}>
          <View style={styles.overlay}>
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.dotsContainer}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === currentIndex && styles.activeDot]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{item.buttonLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{itemVisiblePercentThreshold: 50}}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  slide: {
    width,
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  card: {
    height: 200, // ✅ 強制固定高度（你可以微調）
    justifyContent: 'flex-start', // 保持文字往上靠
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8, // 原本若不一致會造成視覺偏移
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    maxWidth: '90%', // 防止太寬
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6fcd6f',
  },
  button: {
    backgroundColor: '#3cba54',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  login: {
    color: '#4caf50',
    fontWeight: '600',
  },
});
