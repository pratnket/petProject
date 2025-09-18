// src/context/SearchHistoryContext.tsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationHistoryItem {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

type SearchHistoryContextType = {
  history: string[];
  locationHistory: LocationHistoryItem[];
  addKeyword: (keyword: string) => void;
  addLocation: (location: Omit<LocationHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearLocationHistory: () => void;
  removeLocationHistoryItem: (id: string) => void;
};

const SearchHistoryContext = createContext<
  SearchHistoryContextType | undefined
>(undefined);

const STORAGE_KEYS = {
  SEARCH_HISTORY: '@search_history',
  LOCATION_HISTORY: '@location_history',
};

export const SearchHistoryProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryItem[]>([]);

  // 載入儲存的歷史記錄
  useEffect(() => {
    loadHistoryFromStorage();
  }, []);

  const loadHistoryFromStorage = async () => {
    try {
      // 載入搜尋關鍵字歷史
      const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // 載入地點搜尋歷史
      const savedLocationHistory = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_HISTORY);
      if (savedLocationHistory) {
        setLocationHistory(JSON.parse(savedLocationHistory));
      }
    } catch (error) {
      console.error('載入搜尋歷史失敗:', error);
    }
  };

  const addKeyword = async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    
    const newHistory = history.includes(trimmed) 
      ? history 
      : [trimmed, ...history.slice(0, 9)]; // 最多保存 10 筆
    
    setHistory(newHistory);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('儲存搜尋歷史失敗:', error);
    }
  };

  const addLocation = async (location: Omit<LocationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: LocationHistoryItem = {
      ...location,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    // 檢查是否已存在相同地點
    const existingIndex = locationHistory.findIndex(item => item.name === location.name);
    let newLocationHistory: LocationHistoryItem[];

    if (existingIndex >= 0) {
      // 移動到最前面並更新時間戳
      newLocationHistory = [
        {...locationHistory[existingIndex], timestamp: Date.now()},
        ...locationHistory.filter((_, index) => index !== existingIndex),
      ];
    } else {
      // 添加新項目，最多保存 10 筆
      newLocationHistory = [newItem, ...locationHistory.slice(0, 9)];
    }

    setLocationHistory(newLocationHistory);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_HISTORY, JSON.stringify(newLocationHistory));
    } catch (error) {
      console.error('儲存地點歷史失敗:', error);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('清除搜尋歷史失敗:', error);
    }
  };

  const clearLocationHistory = async () => {
    setLocationHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOCATION_HISTORY);
    } catch (error) {
      console.error('清除地點歷史失敗:', error);
    }
  };

  const removeLocationHistoryItem = async (id: string) => {
    const newLocationHistory = locationHistory.filter(item => item.id !== id);
    setLocationHistory(newLocationHistory);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_HISTORY, JSON.stringify(newLocationHistory));
    } catch (error) {
      console.error('刪除地點歷史項目失敗:', error);
    }
  };

  return (
    <SearchHistoryContext.Provider value={{
      history,
      locationHistory,
      addKeyword,
      addLocation,
      clearHistory,
      clearLocationHistory,
      removeLocationHistoryItem,
    }}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistory = (): SearchHistoryContextType => {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error(
      'useSearchHistory must be used within a SearchHistoryProvider',
    );
  }
  return context;
};
