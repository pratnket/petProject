// --- HotelCountLabel.tsx ---
import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface Props {
  count: number;
}

const HotelCountLabel: React.FC<Props> = ({count}) => {
  return <Text style={styles.label}>{count} 件</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 16,
    marginTop: 8,
  },
});

export default HotelCountLabel;
