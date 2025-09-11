import React from 'react';
import {StyleSheet, ViewStyle, StatusBar} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';

interface PageWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  edges?: Edge[];
  showStatusBar?: boolean;
}

/**
 * 統一的頁面包裝組件
 * 自動處理安全區域、狀態欄和基本樣式
 */
const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  style,
  backgroundColor = '#fff',
  statusBarStyle = 'dark-content',
  edges = ['top', 'bottom'],
  showStatusBar = true,
}) => {
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor}, style]}
      edges={edges}>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={backgroundColor}
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
