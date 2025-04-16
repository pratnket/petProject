// src/context/SearchHistoryContext.tsx
import React, {createContext, useContext, useState} from 'react';

type SearchHistoryContextType = {
  history: string[];
  addKeyword: (keyword: string) => void;
  clearHistory: () => void;
};

const SearchHistoryContext = createContext<
  SearchHistoryContextType | undefined
>(undefined);

export const SearchHistoryProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [history, setHistory] = useState<string[]>([]);

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setHistory(prev =>
      prev.includes(trimmed) ? prev : [trimmed, ...prev.slice(0, 9)],
    );
  };

  const clearHistory = () => setHistory([]);

  return (
    <SearchHistoryContext.Provider value={{history, addKeyword, clearHistory}}>
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
