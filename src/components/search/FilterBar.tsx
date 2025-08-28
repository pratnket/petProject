// src/components/search/FilterBar.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // ✅ 新增
import Icon from '../PlatformIcon';

const FilterBar: React.FC = () => {
  const navigation = useNavigation(); // ✅ 初始化導航

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Icon name="swap-vertical" size={20} color="#666" />
        <Text style={styles.label}>排序</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="options" size={20} color="#666" />
        <Text style={styles.label}>篩選</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NearbyMapScreen')} // ✅ 導向地圖畫面
      >
        <Icon name="map" size={20} color="#666" />
        <Text style={styles.label}>地圖</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
});

export default FilterBar;
