import React from 'react';
import {StyleSheet, ViewStyle, StatusBar} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';
import {SafeAreaConfig, PAGE_CONFIGS, PageType} from './SafeAreaConfig';

interface PageWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pageType?: PageType;
  config?: Partial<SafeAreaConfig>;
}

/**
 * 統一的頁面包裝組件
 * 自動處理安全區域、狀態欄和基本樣式
 */
const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  style,
  pageType = 'default',
  config = {},
}) => {
  const pageConfig = {...PAGE_CONFIGS[pageType], ...config};

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: pageConfig.backgroundColor},
        style,
      ]}
      edges={pageConfig.edges}>
      {pageConfig.showStatusBar && (
        <StatusBar
          barStyle={pageConfig.statusBarStyle}
          backgroundColor={pageConfig.backgroundColor}
        />
      )}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PageWrapper;
