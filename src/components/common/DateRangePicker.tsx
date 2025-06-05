import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {useSearchCondition} from '../../context/SearchConditionContext';
import {useModal} from '../../context/ModalContext';

export const DateRangePickerComponent = ({
  onRangeSelected,
}: {
  onRangeSelected?: (start: string, end: string) => void;
}) => {
  const {closeModal} = useModal();
  const {setDateRange} = useSearchCondition();

  const today = moment();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const monthsToRender = 13;
  const monthList = Array.from({length: monthsToRender}, (_, i) =>
    moment().add(i, 'months'),
  );

  const isBetween = (date: moment.Moment) => {
    if (!startDate || !endDate) return false;
    return date.isAfter(startDate, 'day') && date.isBefore(endDate, 'day');
  };

  const handleSelectDate = (date: moment.Moment) => {
    if (date.isBefore(today, 'day')) return; // 禁止選擇過去日期

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date.isBefore(startDate)) {
        setEndDate(startDate);
        setStartDate(date);
        setDateRange({
          start: date.format('YYYY-MM-DD'),
          end: startDate.format('YYYY-MM-DD'),
        });
        onRangeSelected?.(
          date.format('YYYY-MM-DD'),
          startDate.format('YYYY-MM-DD'),
        );
      } else {
        setEndDate(date);
        setDateRange({
          start: startDate.format('YYYY-MM-DD'),
          end: date.format('YYYY-MM-DD'),
        });
        onRangeSelected?.(
          startDate.format('YYYY-MM-DD'),
          date.format('YYYY-MM-DD'),
        );
      }
      closeModal();
    }
  };

  const renderMonth = (month: moment.Moment) => {
    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');
    const days: moment.Moment[] = [];
    const firstDayOfWeek = startOfMonth.day();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(moment.invalid());
    }

    for (let d = startOfMonth.date(); d <= endOfMonth.date(); d++) {
      days.push(month.clone().date(d));
    }

    return (
      <View key={month.format('YYYY-MM')} style={styles.monthContainer}>
        <Text style={styles.monthLabel}>{month.format('YYYY年M月')}</Text>
        <View style={styles.weekHeader}>
          {[...Array(7)].map((_, i) => (
            <Text key={i} style={styles.weekDay}>
              {'日一二三四五六'[i]}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {days.map((day, idx) => {
            const isValid = day.isValid?.();
            const isSelected =
              day.isSame(startDate, 'day') || day.isSame(endDate, 'day');
            const isInRange = isBetween(day);
            const isBeforeToday = !isValid || day.isBefore(today, 'day');
            return (
              <TouchableOpacity
                key={idx}
                disabled={isBeforeToday}
                style={[
                  styles.dayBox,
                  isSelected && styles.selectedDay,
                  isInRange && styles.inRangeDay,
                ]}
                onPress={() => handleSelectDate(day)}>
                <Text
                  style={[
                    styles.dayText,
                    isBeforeToday && styles.disabledDayText,
                  ]}>
                  {isValid ? day.date() : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={monthList}
      keyExtractor={item => item.format('YYYY-MM')}
      renderItem={({item}) => renderMonth(item)}
      contentContainerStyle={styles.container}
      initialNumToRender={3} // 初次只渲染 3 個月
      maxToRenderPerBatch={2} // 每次滑動最多額外渲染 2 個月
      windowSize={5} // 可視範圍大小
      removeClippedSubviews={true} // 移除畫面外的元件以節省記憶體
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  monthContainer: {
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#888',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBox: {
    width: '14.28%',
    height: 40,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 6,
  },
  dayText: {
    color: '#000',
  },
  disabledDayText: {
    color: '#ccc',
  },
  selectedDay: {
    backgroundColor: '#007bff',
  },
  inRangeDay: {
    backgroundColor: '#d0e8ff',
  },
});
