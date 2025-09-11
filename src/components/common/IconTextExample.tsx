// 使用範例：Icon + 文字組合顏色
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from '../PlatformIcon';
import Colors from '../../constants/Colors';

const IconTextExample: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 評分組合：黃色星星 + 深灰數字 */}
      <View style={styles.row}>
        <Icon name="star" size={16} color={Colors.iconText.rating.icon} />
        <Text style={[styles.text, {color: Colors.iconText.rating.text}]}>
          4.5
        </Text>
      </View>

      {/* 距離組合：深灰圖示 + 深灰文字 */}
      <View style={styles.row}>
        <Icon name="location" size={16} color={Colors.iconText.distance.icon} />
        <Text style={[styles.text, {color: Colors.iconText.distance.text}]}>
          381m
        </Text>
      </View>

      {/* 讚組合：淺藍圖示 + 深灰文字 */}
      <View style={styles.row}>
        <Icon
          name="thumbs-up"
          size={16}
          color={Colors.iconText.thumbsUp.icon}
        />
        <Text style={[styles.text, {color: Colors.iconText.thumbsUp.text}]}>
          4.5
        </Text>
      </View>

      {/* 價格組合：主題色圖示 + 主題色文字 */}
      <View style={styles.row}>
        <Icon name="dollar" size={16} color={Colors.iconText.price.icon} />
        <Text style={[styles.text, {color: Colors.iconText.price.text}]}>
          TWD 4,000
        </Text>
      </View>

      {/* 狀態組合：成功 */}
      <View style={styles.row}>
        <Icon
          name="check-circle"
          size={16}
          color={Colors.iconText.status.success.icon}
        />
        <Text
          style={[styles.text, {color: Colors.iconText.status.success.text}]}>
          成功
        </Text>
      </View>

      {/* 狀態組合：錯誤 */}
      <View style={styles.row}>
        <Icon
          name="error"
          size={16}
          color={Colors.iconText.status.error.icon}
        />
        <Text style={[styles.text, {color: Colors.iconText.status.error.text}]}>
          錯誤
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    marginLeft: 4,
    fontSize: 14,
  },
});

export default IconTextExample;
