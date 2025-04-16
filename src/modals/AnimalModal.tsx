import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';
import Icon from '../components/PlatformIcon';
import Colors from '../constants/Colors';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const allAnimals = [
  '小型犬',
  '中型犬',
  '大型犬',
  '超大型犬',
  '貓',
  '兔子',
  '倉鼠',
  '爬行動物',
  '兩棲類',
  '其他',
];

const AnimalModal = () => {
  const {closeModal} = useModal();
  const navigation = useNavigation<NavigationProp>();
  const {condition, setAnimals} = useSearchCondition();
  const selected = condition.animals;

  const toggle = (animal: string) => {
    const updated = selected.includes(animal)
      ? selected.filter(a => a !== animal)
      : [...selected, animal];
    setAnimals(updated);
  };

  const handleSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    closeModal();
    navigation.navigate('Search', {keyword: trimmed});
  };

  return (
    <SafeAreaView style={styles.fullScreen} edges={['top', 'bottom']}>
      <View style={styles.innerContainer}>
        {/* 標題區 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={Colors.icon.default} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>選擇動物</Text>
          </View>
          <View style={styles.rightSpace} />
        </View>

        {/* 選項清單 */}
        <FlatList
          data={allAnimals}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => toggle(item)}>
              <Icon
                name={selected.includes(item) ? 'checkbox' : 'square-outline'}
                size={22}
                color={selected.includes(item) ? '#d2691e' : '#999'}
                style={{marginRight: 10}}
              />
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* 底部雙按鈕 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSearch(condition.keyword)}>
            <Text style={styles.buttonText}>搜尋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={closeModal}>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9ec7ff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 30,
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  rightSpace: {
    width: 30,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
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

export default AnimalModal;
