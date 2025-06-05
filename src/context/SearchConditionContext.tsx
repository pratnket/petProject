import React, {createContext, useContext, useState} from 'react';
import moment from 'moment'; // 新增這行

type DateRange = {start: string; end: string} | null;

type SearchCondition = {
  keyword: string;
  dateRange: DateRange;
  animals: string[];
};

type ContextType = {
  condition: SearchCondition;
  setKeyword: (keyword: string) => void;
  setDateRange: (range: DateRange) => void;
  setAnimals: (animals: string[]) => void;
  clearAll: () => void;
};

const defaultCondition: SearchCondition = {
  keyword: '',
  dateRange: {
    start: moment().format('YYYY-MM-DD'),
    end: moment().add(1, 'day').format('YYYY-MM-DD'),
  },
  animals: [],
};

const SearchConditionContext = createContext<ContextType>({
  condition: defaultCondition,
  setKeyword: () => {},
  setDateRange: () => {},
  setAnimals: () => {},
  clearAll: () => {},
});

export const SearchConditionProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [condition, setCondition] = useState<SearchCondition>(defaultCondition);

  const setKeyword = (keyword: string) =>
    setCondition(prev => ({...prev, keyword}));

  const setDateRange = (range: DateRange) =>
    setCondition(prev => ({...prev, dateRange: range}));

  const setAnimals = (animals: string[]) =>
    setCondition(prev => ({...prev, animals}));

  const clearAll = () => setCondition(defaultCondition);

  return (
    <SearchConditionContext.Provider
      value={{condition, setKeyword, setDateRange, setAnimals, clearAll}}>
      {children}
    </SearchConditionContext.Provider>
  );
};

export const useSearchCondition = () => useContext(SearchConditionContext);
