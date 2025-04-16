import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  dayNames: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天',
};
LocaleConfig.defaultLocale = 'zh';

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const DateRangePicker = ({
  onRangeSelected,
}: {
  onRangeSelected?: (start: string, end: string) => void;
}) => {
  const today = new Date();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(formatDate(today));

  const onDayPress = (day: {dateString: string}) => {
    const selected = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (selected < startDate) {
        setEndDate(startDate);
        setStartDate(selected);
        onRangeSelected?.(selected, startDate);
      } else {
        setEndDate(selected);
        onRangeSelected?.(startDate, selected);
      }
    }
  };

  const goToPreviousMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(formatDate(date));
  };

  const goToNextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(formatDate(date));
  };

  const displayYearMonth = () => {
    const date = new Date(currentDate);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{displayYearMonth()}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        key={currentDate} // 強制刷新以更新月份
        current={currentDate}
        onDayPress={onDayPress}
        markingType={'period'}
        markedDates={getMarkedDates(startDate, endDate)}
        hideArrows={true}
        hideExtraDays={false}
        disableMonthChange={true}
        renderHeader={() => null} // 隱藏內建標題列
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textSectionTitleColor: '#333',
          selectedDayBackgroundColor: '#1E90FF',
          selectedDayTextColor: '#fff',
          todayTextColor: '#1E90FF',
          dayTextColor: '#222',
          textDisabledColor: '#ccc',
          arrowColor: '#1E90FF',
          textDayFontWeight: '500',
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

const getMarkedDates = (start: string | null, end: string | null) => {
  if (!start) return {};
  if (!end) {
    return {
      [start]: {
        startingDay: true,
        endingDay: true,
        color: '#dfeeff',
        textColor: 'black',
      },
    };
  }

  const dates: any = {};
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    const dateStr = formatDate(current);
    dates[dateStr] = {
      color: '#dfeeff',
      textColor: 'black',
      ...(dateStr === start && {startingDay: true}),
      ...(dateStr === end && {endingDay: true}),
    };
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#1E90FF',
    paddingHorizontal: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
