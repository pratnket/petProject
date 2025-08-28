import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {useSearchCondition} from '../../context/SearchConditionContext';
import {useModal} from '../../context/ModalContext';

export const DateRangePickerSelectComponent = ({
  onRangeSelected,
}: {
  onRangeSelected?: (start: string, end: string) => void;
}) => {
  const {closeModal} = useModal();
  const {setDateRange} = useSearchCondition();

  const today = moment();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [month, setMonth] = useState(moment());

  const isBetween = (date: moment.Moment) => {
    if (!startDate || !endDate) return false;
    return date.isAfter(startDate, 'day') && date.isBefore(endDate, 'day');
  };

  const isStart = (date: moment.Moment) => startDate?.isSame(date, 'day');
  const isEnd = (date: moment.Moment) => endDate?.isSame(date, 'day');

  const handleSelectDate = (date: moment.Moment) => {
    if (date.isBefore(today, 'day')) return;

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

  const resetSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const renderMonth = () => {
    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');
    const days: moment.Moment[] = [];
    const firstDayOfWeek = startOfMonth.day();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(moment.invalid());
    }

    for (let d = 1; d <= endOfMonth.date(); d++) {
      days.push(startOfMonth.clone().date(d));
    }

    return (
      <View style={styles.monthContainer}>
        {/* 月份標頭與重新選擇 */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => setMonth(month.clone().subtract(1, 'month'))}>
            <Text style={styles.navArrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{month.format('YYYY年 M月')}</Text>
          <TouchableOpacity
            onPress={() => setMonth(month.clone().add(1, 'month'))}>
            <Text style={styles.navArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resetRow}>
          <Text style={styles.label}>選擇日期</Text>
          <TouchableOpacity onPress={resetSelection}>
            <Text style={styles.resetText}>重新</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekHeader}>
          {'日一二三四五六'.split('').map((d, i) => (
            <Text
              key={i}
              style={[
                styles.weekDay,
                i === 0 && styles.sunday,
                i === 6 && styles.saturday,
              ]}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((day, idx) => {
            const isValid = day.isValid?.();
            const isBeforeToday = !isValid || day.isBefore(today, 'day');
            const selectedStart = isStart(day);
            const selectedEnd = isEnd(day);
            const inRange = isBetween(day);

            return (
              <TouchableOpacity
                key={idx}
                disabled={isBeforeToday}
                style={[
                  styles.dayBox,
                  inRange && styles.rangeDay,
                  selectedStart && styles.startDay,
                  selectedEnd && styles.endDay,
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

  return <View style={styles.container}>{renderMonth()}</View>;
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff'},
  monthContainer: {marginBottom: 24},
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  navArrow: {fontSize: 20, color: '#444', paddingHorizontal: 8},
  monthLabel: {fontSize: 20, fontWeight: 'bold', color: '#111'},
  resetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {fontSize: 16, fontWeight: '600'},
  resetText: {fontSize: 14, color: '#6495ED'},
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
  },
  sunday: {color: 'red'},
  saturday: {color: '#007AFF'},
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBox: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  disabledDayText: {color: '#ccc'},
  rangeDay: {
    backgroundColor: '#F0F8FF',
  },
  startDay: {
    backgroundColor: '#D9EBFF',
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  endDay: {
    backgroundColor: '#D9EBFF',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
});
