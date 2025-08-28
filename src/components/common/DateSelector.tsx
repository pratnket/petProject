// src/components/common/DateSelector.tsx

import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import dayjs from 'dayjs';

type Props = {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates?: string[]; // ⬅️ 加入可選的日期清單
};

const DateSelector = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
}: Props) => {
  const generate7Days = () => {
    const today = dayjs();
    const weekMap = ['日', '一', '二', '三', '四', '五', '六'];

    return Array.from({length: 7}).map((_, i) => {
      const date = today.add(i, 'day');
      return {
        label: i === 0 ? '今天' : weekMap[parseInt(date.format('d'))], // 顯示：今天 / 一 / 二 ...
        value: date.format('YYYY-MM-DD'),
        day: date.format('D'),
      };
    });
  };

  const dates = generate7Days();

  const renderItem = ({item}) => {
    const isSelected = item.value === selectedDate;
    const isDisabled = !availableDates.includes(item.value);

    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => onDateSelect(item.value)}
        style={[
          styles.item,
          isSelected && styles.selectedItem,
          isDisabled && styles.disabledItem,
        ]}>
        <Text
          style={[
            styles.label,
            isSelected && styles.selectedLabel,
            isDisabled && styles.disabledLabel,
          ]}>
          {item.label}
        </Text>
        <Text
          style={[
            styles.day,
            isSelected && styles.selectedDay,
            isDisabled && styles.disabledDay,
          ]}>
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={dates}
      horizontal
      renderItem={renderItem}
      keyExtractor={item => item.value}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap: 8}}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedItem: {
    backgroundColor: '#f97316',
  },
  disabledItem: {
    backgroundColor: '#f3f4f6',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedLabel: {
    color: '#fff',
  },
  disabledLabel: {
    color: '#9ca3af',
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedDay: {
    color: '#fff',
  },
  disabledDay: {
    color: '#9ca3af',
  },
});

export default DateSelector;
