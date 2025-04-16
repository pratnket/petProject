import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import HotelCard from '../common/HotelCard';
import HotelCountLabel from '../search/HotelCountLabel';
import mockHotels from '../../constants/mockData';

const PAGE_SIZE = 10;

const HotelList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [displayedData, setDisplayedData] = useState(
    mockHotels.slice(0, PAGE_SIZE),
  );
  const throttleRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (page * PAGE_SIZE >= mockHotels.length) return;
    setPage(prev => prev + 1);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (throttleRef.current) return; // 節流：限制執行頻率
    throttleRef.current = true;
    setTimeout(() => {
      throttleRef.current = false;
    }, 100); // 100ms 內只觸發一次

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      handleLoadMore();
    }
  }, [handleLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setDisplayedData(mockHotels.slice(0, page * PAGE_SIZE));
  }, [page]);

  return (
    <View style={styles.container}>
      <HotelCountLabel count={mockHotels.length} />
      {displayedData.map(item => (
        <HotelCard key={item.id} {...item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
});

export default HotelList;
