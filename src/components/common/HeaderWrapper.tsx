import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaConfig, PAGE_CONFIGS, PageType} from './SafeAreaConfig';

interface HeaderWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pageType?: PageType;
  config?: Partial<SafeAreaConfig>;
}

/**
 * 統一的頁面標題區域包裝組件
 * 自動處理不同頁面類型的標題間距
 */
const HeaderWrapper: React.FC<HeaderWrapperProps> = ({
  children,
  style,
  pageType = 'default',
  config = {},
}) => {
  const pageConfig = {...PAGE_CONFIGS[pageType], ...config};
  const {headerPadding} = pageConfig;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: headerPadding.top,
          paddingBottom: headerPadding.bottom,
          paddingHorizontal: headerPadding.horizontal,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});

export default HeaderWrapper;
