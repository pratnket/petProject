import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import PlatformImageBackground from '../components/PlatformImageBackground';
import IconInput from '../components/PlatformIconInput';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import {useSearchHistory} from '../context/SearchHistoryContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';

// Modals
import LocationModal from '../modals/LocationModal';
import DateModal from '../modals/DateModal';
import AnimalModal from '../modals/AnimalModal';

const formatDateWithWeekday = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const HomeScreen: React.FC = () => {
  const {openModal, activeModal} = useModal();
  const {condition} = useSearchCondition();
  const {addKeyword} = useSearchHistory();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Search'>>();
  const {dateRange} = condition;

  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    const keyword = condition.keyword.trim();
    const hasDates = dateRange?.start && dateRange?.end;

    const showAlert = (msg: string) => {
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert(msg);
      }
    };

    if (!keyword) {
      showAlert('請輸入地點');
      return;
    }
    if (!hasDates) {
      showAlert('請選擇入住與退房日期');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addKeyword(keyword);
      navigation.navigate('Search', {keyword});
      setLoading(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <PlatformImageBackground
        source={require('../assets/Background.jpg')}
        src="/assets/Background.jpg">
        <View style={styles.card}>
          <IconInput
            placeholder="你要去哪裡"
            iconName="location-outline"
            onPress={() => openModal('location')}
            value={condition.keyword}
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <IconInput
                placeholder="入住日期"
                iconName="calendar-outline"
                value={
                  dateRange?.start ? formatDateWithWeekday(dateRange.start) : ''
                }
                onPress={() => openModal('date')}
              />
            </View>
            <View style={styles.gap} />
            <View style={styles.halfInput}>
              <IconInput
                placeholder="退房日期"
                iconName="calendar-outline"
                value={
                  dateRange?.end ? formatDateWithWeekday(dateRange.end) : ''
                }
                onPress={() => openModal('date')}
              />
            </View>
          </View>
          <IconInput
            placeholder="對象動物"
            iconName="paw-outline"
            onPress={() => openModal('animal')}
            value={condition.animals.join(', ')}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchText}>搜尋</Text>
            )}
          </TouchableOpacity>
        </View>
      </PlatformImageBackground>

      {activeModal === 'location' && <LocationModal />}
      {activeModal === 'date' && <DateModal />}
      {activeModal === 'animal' && <AnimalModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
  },
  gap: {
    width: 12,
  },
  card: {
    width: '96%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    transform: [{translateY: 80}],
    borderColor: '#B3B3B3',
    borderWidth: 4,
  },
  searchButton: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
