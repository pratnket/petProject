// --- HotelList.native.tsx ---
import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import HotelCard from '../common/HotelCard';
import HotelCountLabel from '../search/HotelCountLabel';
import mockHotels from '../../constants/mockData';

const PAGE_SIZE = 10;

const HotelList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [displayedData, setDisplayedData] = useState(
    mockHotels.slice(0, PAGE_SIZE),
  );

  useEffect(() => {
    const newData = mockHotels.slice(0, page * PAGE_SIZE);
    setDisplayedData(newData);
  }, [page]);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE >= mockHotels.length) return;
    setPage(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <HotelCountLabel count={mockHotels.length} />
      <FlatList
        data={displayedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <HotelCard {...item} />}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
});

export default HotelList;
