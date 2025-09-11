import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';

interface ModalWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: Edge[];
}

/**
 * 專門用於 Modal 的安全區域包裝組件
 * 預設全螢幕覆蓋，處理安全區域
 */
const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  style,
  backgroundColor = '#fff',
  edges = ['top', 'bottom'],
}) => {
  return (
    <SafeAreaView
      style={[styles.fullScreen, {backgroundColor}, style]}
      edges={edges}>
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
  },
});

export default ModalWrapper;
