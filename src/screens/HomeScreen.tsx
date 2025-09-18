import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  SafeAreaView,
} from 'react-native';
import CarouselBanner from '../components/common/CarouselBanner';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Modals
import LocationModal from '../modals/LocationModal';
import DateModal from '../modals/DateModal';
import AnimalModal from '../modals/AnimalModal';

// Components
import FloatingTestButton from '../components/common/FloatingTestButton';

const HomeScreen: React.FC = () => {
  const {openModal, activeModal} = useModal();
  const {condition} = useSearchCondition();

  // 使用 useRef 來避免 useEffect 依賴問題
  const openModalRef = useRef(openModal);
  openModalRef.current = openModal;

  // 檢查是否首次啟動，顯示歡迎Modal
  useEffect(() => {
    if (Platform.OS === 'web') {
      // 網頁版跳過歡迎Modal
      return;
    }

    const checkFirstLaunch = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
        console.log('🔍 檢查首次啟動 - hasSeenWelcome:', hasSeenWelcome);

        if (!hasSeenWelcome) {
          // 沒有看過歡迎Modal，顯示它
          console.log('🎉 首次啟動，顯示歡迎Modal');
          openModalRef.current('welcome');
        } else {
          console.log('✅ 已經看過歡迎Modal，不顯示');
        }
      } catch (error) {
        console.error('檢查首次啟動失敗:', error);
      }
    };
    checkFirstLaunch();
  }, []); // 移除 openModal 依賴，避免無限循環

  return (
    <View style={styles.container}>
      {/* 輪播廣告背景 - 延伸到全螢幕，不受安全區域限制 */}
      <CarouselBanner
        height={300}
        autoPlay={true}
        autoPlayInterval={4000}
        showIndicators={false}
        onBannerPress={banner => {
          console.log('廣告點擊:', banner);
          // 這裡可以處理廣告點擊事件
        }}
      />

      {/* 搜索卡片 - 使用固定位置但適應安全區域 */}
      <SafeAreaView style={styles.safeAreaContainer} pointerEvents="box-none">
        <View style={styles.searchCard} pointerEvents="auto">
          <View style={styles.searchHeader}>
            <TouchableOpacity
              style={styles.searchInput}
              onPress={() => openModal('location')}
              activeOpacity={0.7}>
              <View style={styles.searchInputContent}>
                <Text style={styles.searchPlaceholder}>
                  {condition.keyword || '立即搜尋寵物旅館'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                // 打開 LocationModal，顯示完整的搜索和篩選功能
                openModal('location');
              }}
              activeOpacity={0.7}>
              <View style={styles.filterIcon}>
                <View style={styles.filterLine} />
                <View style={styles.filterLine} />
                <View style={styles.filterLine} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {activeModal === 'location' && <LocationModal />}
      {activeModal === 'date' && <DateModal />}
      {activeModal === 'animal' && <AnimalModal />}

      {/* 可拖曳的測試按鈕 */}
      <FloatingTestButton visible={__DEV__} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeAreaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    // 使用平台特定的 paddingTop
    paddingTop: Platform.select({
      ios: 180, // iOS: SafeAreaView 會自動處理安全區域
      android: 20, // Android: 需要額外空間給狀態列
      default: 180, // Web 和其他平台
    }),
    zIndex: 10,
  },
  searchCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    // 平台特定的陰影效果
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 12,
  },
  searchInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 18,
    height: 12,
  },
  filterLine: {
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 1,
    borderRadius: 1,
  },
});

export default HomeScreen;
