// src/components/Divider.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';

const rem = (value: number) => value * 16;

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: rem(1),
  },
});

export default Divider;
