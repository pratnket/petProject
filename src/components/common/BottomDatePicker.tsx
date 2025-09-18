import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from '../PlatformIcon';
import {useSearchCondition} from '../../context/SearchConditionContext';

const {height: screenHeight} = Dimensions.get('window');
const MODAL_HEIGHT = screenHeight * 0.6; // 佔 60% 螢幕高度

interface BottomDatePickerProps {
  visible: boolean;
  onClose: () => void;
  selectedLocation?: string;
}

const BottomDatePicker: React.FC<BottomDatePickerProps> = ({
  visible,
  onClose,
  selectedLocation = '',
}) => {
  const {condition, setDateRange} = useSearchCondition();
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

  // 生成日曆數據
  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 生成當月的日期
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const calendarDays = [];
    
    // 添加空白格子（月初前的空格）
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // 添加日期
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    
    return {
      year: currentYear,
      month: currentMonth,
      days: calendarDays,
    };
  };

  const calendarData = generateCalendarData();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const handleDatePress = (day: number) => {
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // 選擇開始日期
      setSelectedStartDate(dateStr);
      setSelectedEndDate(null);
    } else {
      // 選擇結束日期
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(dateStr);
      
      if (endDate < startDate) {
        // 如果結束日期早於開始日期，交換
        setSelectedStartDate(dateStr);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(dateStr);
      }
    }
  };

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      setDateRange({
        start: selectedStartDate,
        end: selectedEndDate,
      });
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setDateRange({start: '', end: ''});
  };

  const isDateSelected = (day: number) => {
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedStartDate || dateStr === selectedEndDate;
  };

  const isDateInRange = (day: number) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(dateStr);
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    return date >= start && date <= end;
  };

  const isStartDate = (day: number) => {
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedStartDate;
  };

  const isEndDate = (day: number) => {
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedEndDate;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContainer}>
          {/* 日期選擇標題 */}
          <View style={styles.titleSection}>
            <Text style={styles.modalTitle}>選擇日期區間</Text>
          </View>

          {/* 週標題 */}
          <View style={styles.weekHeader}>
            {weekDays.map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          {/* 月份和年份 */}
          <Text style={styles.monthYear}>
            {calendarData.month + 1}月 {calendarData.year}
          </Text>

          {/* 日曆格子 */}
          <ScrollView style={styles.calendarContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.calendarGrid}>
              {/* 按週渲染，這樣可以更好地控制連接效果 */}
              {Array.from({length: Math.ceil(calendarData.days.length / 7)}, (_, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {calendarData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                    const actualIndex = weekIndex * 7 + dayIndex;
                    const isInRange = day && isDateInRange(day);
                    const isStart = day && isStartDate(day);
                    const isEnd = day && isEndDate(day);
                    const isMiddle = isInRange && !isStart && !isEnd;

                    return (
                      <View key={actualIndex} style={styles.dayContainer}>
                        {/* 背景連接層 */}
                        {isInRange && (
                          <View style={[
                            styles.rangeBackground,
                            isStart && styles.rangeBackgroundStart,
                            isEnd && styles.rangeBackgroundEnd,
                            isStart && isEnd && styles.rangeBackgroundSingle,
                          ]} />
                        )}
                        
                        {/* 日期按鈕 */}
                        <TouchableOpacity
                          style={[
                            styles.dayCell,
                            day === null && styles.emptyCell,
                          ]}
                          onPress={() => day && handleDatePress(day)}
                          disabled={day === null}>
                          {day && (
                            <View style={[
                              styles.dayButton,
                              (isStart || isEnd) && styles.selectedDayButton,
                            ]}>
                              <Text style={[
                                styles.dayText,
                                (isStart || isEnd) && styles.selectedDayText,
                                isMiddle && styles.rangeDayText,
                              ]}>
                                {day}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  {/* 補齊空白格子到 7 個 */}
                  {Array.from({length: 7 - calendarData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).length}, (_, emptyIndex) => (
                    <View key={`empty-${weekIndex}-${emptyIndex}`} style={styles.dayContainer} />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* 底部按鈕 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>清除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>套用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    height: MODAL_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekDay: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    width: '14.28%', // 與日期格子相同寬度
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 16,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarGrid: {
    paddingHorizontal: 10,
  },
  weekRow: {
    flexDirection: 'row',
    marginVertical: 1,
  },
  dayContainer: {
    width: '14.28%',
    height: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeBackground: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 0,
    right: 0,
    backgroundColor: '#e6d3c1',
  },
  rangeBackgroundStart: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    left: '25%', // 從日期按鈕開始
  },
  rangeBackgroundEnd: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    right: '25%', // 到日期按鈕結束
  },
  rangeBackgroundSingle: {
    borderRadius: 6,
    left: '25%',
    right: '25%',
  },
  dayCell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCell: {
    // 空白格子
  },
  dayButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedDayButton: {
    backgroundColor: '#A0522D',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  rangeDayText: {
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#A0522D', // 與選中日期相同的棕色
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BottomDatePicker;
