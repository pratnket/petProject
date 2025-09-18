import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import ModalWrapper from '../components/safe-area/ModalWrapper';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import {useSearchHistory} from '../context/SearchHistoryContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';
import Icon from '../components/PlatformIcon';
import LocationInput from '../components/search/LocationInput';
import RecentSearchList from '../components/search/RecentSearchList';
import locationService from '../utils/locationService';
import IconInput from '../components/PlatformIconInput';
import BottomDatePicker from '../components/common/BottomDatePicker';

// 日期格式化函數
const formatDateWithWeekday = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const LocationModal = () => {
  const {closeModal, openModal} = useModal();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Search'>>();
  const {addLocation, locationHistory} = useSearchHistory();
  const {condition} = useSearchCondition();
  const {dateRange} = condition;
  
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentView, setCurrentView] = useState<'location' | 'date' | 'animal'>('location');

  // 處理搜索提交
  const handleSearch = async (text?: string) => {
    const searchQuery = text || searchText;
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setLoading(true);
    
    try {
      // 添加到搜尋歷史
      await addLocation({
        name: trimmed,
        address: trimmed,
      });

      // 關閉 Modal 並導航到搜索結果頁面
      closeModal();
      navigation.navigate('Search', {keyword: trimmed});
    } catch (error) {
      console.error('搜索失敗:', error);
      Alert.alert('搜索失敗', '請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  // 處理附近區域按鈕
  const handleNearbyPress = async () => {
    setNearbyLoading(true);
    
    try {
      const result = await locationService.getNearbyLocation();
      
      if (result.success && result.coordinates) {
        const address = await locationService.reverseGeocode(result.coordinates);
        setSearchText(address);
        
        // 添加到搜尋歷史
        await addLocation({
          name: '附近區域',
          address: address,
          coordinates: result.coordinates,
        });
      }
    } catch (error) {
      console.error('獲取附近位置失敗:', error);
    } finally {
      setNearbyLoading(false);
    }
  };

  // 處理歷史記錄選擇
  const handleLocationSelect = (location: any) => {
    setSearchText(location.name);
    // 直接搜索選中的位置
    handleSearch(location.name);
  };

  return (
    <ModalWrapper style={styles.fullScreen}>
      <View style={styles.innerContainer}>
        {/* 標題欄 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>搜尋</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 根據當前視圖顯示不同內容 */}
        {currentView === 'location' && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 搜尋地點區塊 */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>搜尋地點</Text>
              <LocationInput
                value={searchText}
                onChangeText={setSearchText}
                onSubmit={() => handleSearch()}
                onNearbyPress={handleNearbyPress}
                placeholder="輸入地點"
                loading={loading}
                nearbyLoading={nearbyLoading}
              />

              {/* 搜尋歷史 - 在同一個卡片內 */}
              <RecentSearchList
                onLocationSelect={handleLocationSelect}
                maxItems={10}
              />
            </View>

            {/* 日期選擇區塊 */}
            <View style={styles.cardSection}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>日期</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.optionValue}>
                    {dateRange?.start && dateRange?.end 
                      ? `${dateRange.start.slice(5).replace('-', '月')}日 週三 - ${dateRange.end.slice(5).replace('-', '月')}日 週五`
                      : '選擇日期'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 寵物數量區塊 */}
            <View style={styles.cardSection}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>寵物數量</Text>
                <TouchableOpacity onPress={() => setCurrentView('animal')}>
                  <Text style={styles.optionValue}>
                    {condition.animals.length || '1'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 服務類型區塊 */}
            <View style={styles.cardSection}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>服務類型</Text>
                <TouchableOpacity>
                  <Text style={styles.optionValue}>寄宿過夜</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 底部按鈕區域 */}
            <View style={styles.bottomActions}>
              <TouchableOpacity style={styles.clearButton}>
                <Text style={styles.clearButtonText}>清除</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => handleSearch()}>
                <Text style={styles.searchButtonText}>搜尋</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 日期選擇視圖 */}
        {currentView === 'date' && (
          <View style={styles.subView}>
            <View style={styles.subHeader}>
              <TouchableOpacity onPress={() => setCurrentView('location')} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.subTitle}>選擇日期</Text>
              <View style={styles.placeholder} />
            </View>
            <View style={styles.subContent}>
              <Text style={styles.comingSoon}>日期選擇功能開發中...</Text>
            </View>
          </View>
        )}

        {/* 動物選擇視圖 */}
        {currentView === 'animal' && (
          <View style={styles.subView}>
            <View style={styles.subHeader}>
              <TouchableOpacity onPress={() => setCurrentView('location')} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.subTitle}>對象動物</Text>
              <View style={styles.placeholder} />
            </View>
            <View style={styles.subContent}>
              <Text style={styles.comingSoon}>動物選擇功能開發中...</Text>
            </View>
          </View>
        )}

        {/* 底部日期選擇器 */}
        <BottomDatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          selectedLocation={searchText}
        />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000, // 確保 Modal 在最上層
    elevation: 1000, // Android 需要
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32, // 與 backButton 相同寬度，保持居中
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  optionValue: {
    fontSize: 16,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  searchButton: {
    flex: 2,
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  subView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LocationModal;

