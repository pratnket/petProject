import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TestMapView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>地圖測試 - 如果看到這個文字，說明組件可以正常載入</Text>
      <Text style={styles.text}>下一步會逐步測試 MapView 組件</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    color: '#333',
  },
});

export default TestMapView;
