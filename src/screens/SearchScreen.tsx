import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import PageWrapper from '../components/safe-area/PageWrapper';
import HeaderWrapper from '../components/safe-area/HeaderWrapper';
import SearchBar from '../components/search/SearchBar';
import {useNavigation, useRoute} from '@react-navigation/native'; // 正確導入 useRoute
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native'; // 正確導入 RouteProp
import {RootStackParamList} from '../navigation/MainNavigator'; // 根據你的 MainNavigator 路徑

import FilterBar from '../components/search/FilterBar';
import HotelList from '../components/PlatformHotelList';

// 設定 route 和 navigation 型別
type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Search'
>;
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const route = useRoute<SearchScreenRouteProp>(); // 取得傳遞過來的參數
  const {keyword} = route.params; // 從 params 中取出 keyword

  const [searchKeyword, setSearchKeyword] = useState<string>(keyword);

  useEffect(() => {
    // 如果 route.params 有變動，可以更新 searchKeyword
    setSearchKeyword(keyword);
  }, [keyword]);

  // 返回上一頁
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 清除文字
  const handleClearText = () => setSearchKeyword('');

  // 重新導向搜索頁
  const handleSearch = (text: string) => {
    if (!text.trim()) {
      return;
    }
    navigation.navigate('Search', {keyword: text.trim()}); // ✅ 導頁
  };

  return (
    <PageWrapper pageType="search" style={styles.container}>
      <HeaderWrapper pageType="search" style={styles.header}>
        <SearchBar
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmit={() => handleSearch(searchKeyword)}
          onClear={handleClearText}
          onBack={handleGoBack}
          showClearIcon={true}
          showSearchIcon={false}
        />
        <FilterBar />
      </HeaderWrapper>
      <View style={styles.listArea}>
        <HotelList />
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#9ec7ff', // 淺藍色背景
  },
  listArea: {
    flex: 1, // ⭐️ 必須讓列表區塊可以伸展
  },
});

export default SearchScreen;
