import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';
import {SafeAreaConfig, PAGE_CONFIGS, PageType} from './SafeAreaConfig';

interface ModalWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pageType?: PageType;
  config?: Partial<SafeAreaConfig>;
}

/**
 * 專門用於 Modal 的安全區域包裝組件
 * 預設全螢幕覆蓋，處理安全區域
 */
const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  style,
  pageType = 'modal',
  config = {},
}) => {
  const pageConfig = {...PAGE_CONFIGS[pageType], ...config};

  return (
    <SafeAreaView
      style={[
        styles.fullScreen,
        {backgroundColor: pageConfig.backgroundColor},
        style,
      ]}
      edges={pageConfig.edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 999, // 確保 Modal 在最上層
    elevation: 999, // Android 需要
  },
});

export default ModalWrapper;
