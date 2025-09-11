import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  backgroundColor?: string;
}

/**
 * 統一的 SafeAreaView 包裝組件
 * 預設處理頂部和底部安全區域，可自訂邊緣和樣式
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  edges = ['top', 'bottom'],
  backgroundColor = '#fff',
}) => {
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor}, style]}
      edges={edges}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
