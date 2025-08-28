// src/components/common/TimePriceSelector.tsx

import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs from 'dayjs';

interface TimeSlot {
  selltime: string;
  price: number;
  remain_count: number;
}

interface Props {
  selectedDate: string; // e.g. '2025-07-25'
  timeSlots: Record<string, TimeSlot[] | TimeSlot[][]>;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const LABEL_WIDTH = 72;
const LABEL_HEIGHT = 110; // 跟 itemCol 高度一致

const TimePriceSelector: React.FC<Props> = ({
  selectedDate,
  timeSlots,
  selectedIndex,
  onSelect,
}) => {
  const rawSlots = timeSlots[selectedDate] ?? [];
  const flattenedSlots: TimeSlot[] = Array.isArray(rawSlots[0])
    ? (rawSlots as TimeSlot[][]).flat()
    : (rawSlots as TimeSlot[]);

  // 將標籤作為第一個 item
  const dataWithLabel = [
    {type: 'label'},
    ...flattenedSlots.map(slot => ({type: 'slot', ...slot})),
  ];

  // 動態取得 divider 的 y 座標
  const [dividerTop, setDividerTop] = React.useState(0);

  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        data={dataWithLabel}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          if (item.type === 'label') {
            return (
              <View style={styles.labelCol}>
                <View style={styles.dotPlaceholder}></View>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>TWD</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>當地時間</Text>
                </View>
              </View>
            );
          }
          if (item.type !== 'slot') return null;
          const slot = item as TimeSlot & {type: string};
          // index-1 對應原本的 selectedIndex
          const slotIndex = index - 1;
          const isSelected = slotIndex === selectedIndex;
          const price = slot.price.toLocaleString();
          const time = dayjs(slot.selltime).format('HH:mm');
          return (
            <TouchableOpacity
              onPress={() => onSelect(slotIndex)}
              style={styles.itemCol}
              activeOpacity={0.8}>
              <View style={styles.dotWrap}>
                <View
                  style={[
                    styles.dot,
                    isSelected ? styles.selectedDot : styles.unselectedDot,
                  ]}
                />
              </View>
              <Text style={[styles.price, isSelected && styles.selectedText]}>
                {price}
              </Text>
              <View
                style={styles.divider}
                onLayout={e => {
                  // 只在第一次設置（或每次 render 都設置也可）
                  if (dividerTop === 0) setDividerTop(e.nativeEvent.layout.y);
                }}
              />
              <Text style={[styles.time, isSelected && styles.selectedText]}>
                {time}
              </Text>
              {/* 直線，僅選中時顯示 */}
              {isSelected && (
                <View style={[styles.verticalLine, {top: dividerTop - 4}]} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  labelCol: {
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 0,
    paddingTop: 0,
  },
  dotPlaceholder: {
    height: 50,
  },
  labelRow: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  labelText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  flatListContent: {
    alignItems: 'flex-start',
    paddingLeft: 0,
    gap: 0,
  },
  itemCol: {
    width: 72,
    height: LABEL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 0,
    paddingVertical: 0,
    position: 'relative',
  },
  dotWrap: {
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 32,
    borderRadius: 6,
    marginBottom: 2,
  },
  selectedDot: {
    backgroundColor: '#FF5722',
    opacity: 1,
  },
  unselectedDot: {
    backgroundColor: '#FF5722',
    opacity: 0.2,
  },
  price: {
    fontSize: 12,
    color: '#222',
    fontWeight: '400',
    marginTop: 2,
    textAlign: 'center',
    paddingVertical: 4,
  },
  time: {
    fontSize: 12,
    color: '#222',
    fontWeight: '400',
    marginTop: 2,
    textAlign: 'center',
    paddingVertical: 4,
  },
  selectedText: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: -1}],
    width: 2,
    height: 8,
    backgroundColor: '#FF5722',
    borderRadius: 1,
    zIndex: 2,
  },
});

export default TimePriceSelector;
