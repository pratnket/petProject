import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useModal} from '../context/ModalContext';
import {useSearchCondition} from '../context/SearchConditionContext';
import {DateRangePicker} from '../components/common/DateRangePicker';
import Icon from '../components/PlatformIcon';

const DateModal = () => {
  const {closeModal} = useModal();
  const {setDateRange} = useSearchCondition();
  const insets = useSafeAreaInsets();

  const handleRangeSelected = (start: string, end: string) => {
    console.log('✅ 選擇的日期區間：', start, '到', end);
    setDateRange({start, end});
    closeModal();
  };

  return (
    <SafeAreaView
      style={[styles.fullScreen, {paddingTop: insets.top}]}
      edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeModal} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>選擇日期</Text>
        </View>
        <View style={styles.rightSpace} />
      </View>

      <View style={styles.content}>
        <DateRangePicker onRangeSelected={handleRangeSelected} />
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
  content: {
    flex: 1,
    padding: 20,
  },
});

export default DateModal;
