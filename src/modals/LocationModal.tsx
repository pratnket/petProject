import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import {useSearchHistory} from '../context/SearchHistoryContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';
import SearchBar from '../components/search/SearchBar';
import useCurrentLocation from '../hooks/useCurrentLocation';
import Icon from '../components/PlatformIcon';

const LocationModal = () => {
  const {closeModal} = useModal();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Search'>>();
  const {addKeyword, history, clearHistory} = useSearchHistory();
  const {setKeyword, condition} = useSearchCondition();
  const {address, error, openSettings, shouldShowSettings} =
    useCurrentLocation();

  const handleSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addKeyword(trimmed);
    closeModal();
    navigation.navigate('Search', {keyword: trimmed});
  };

  const handleUseCurrentLocation = () => {
    if (address) {
      setKeyword(address);
    } else if (error) {
      Alert.alert(
        '定位失敗',
        error,
        shouldShowSettings
          ? [
              {text: '取消', style: 'cancel'},
              {text: '前往設定', onPress: openSettings},
            ]
          : [{text: '確定'}],
      );
    }
  };

  return (
    <SafeAreaView style={styles.fullScreen} edges={['bottom']}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <SearchBar
            value={condition.keyword}
            onChangeText={setKeyword}
            onSubmit={() => handleSearch(condition.keyword)}
            onClear={() => setKeyword('')}
            onBack={closeModal}
            showClearIcon={true}
            showSearchIcon={false}
          />
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleUseCurrentLocation}>
            <View style={styles.locationRow}>
              <Icon name="map-outline" size={20} color="#555" />
              <Text style={styles.locationText}>使用目前位置</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>搜尋紀錄</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearBtn}>清除</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={history}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.historyItemRow}
                onPress={() => handleSearch(item)}>
                <Icon name="time-outline" size={20} color="#555" />
                <Text style={styles.historyItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSearch(condition.keyword)}>
            <Text style={styles.buttonText}>搜尋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              const trimmed = condition.keyword.trim();
              if (!trimmed) return;
              setKeyword(trimmed);
              closeModal();
            }}>
            <Text style={styles.buttonText}>搜索條件追加</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 8,
  },
  locationBtn: {
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: '#007AFF',
    fontSize: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  historyItemText: {
    fontSize: 16,
    color: '#000',
  },
  clearBtn: {
    fontSize: 14,
    color: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#218838',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationModal;
