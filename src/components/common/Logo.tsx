import React from 'react';
import {View, StyleSheet, ViewStyle, Image} from 'react-native';
import {getImageSource} from '../../utils/getImageSource';
import ImageAssets from '../../constants/ImageAssets';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({size = 120, style}) => {
  return (
    <View style={[styles.container, {width: size, height: size}, style]}>
      {/* 這裡可以導入SVG，暫時用View代替 */}
      <View style={styles.logoPlaceholder}>
        {/* 如果SVG導入有問題，這裡會顯示一個簡單的圖案 */}
        <Image
          source={getImageSource(ImageAssets.Logo)}
          style={styles.logoPlaceholder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    backgroundColor: '#8B4513', // 棕色圓形背景
    borderRadius: 999,
    position: 'absolute',
  },
  logoPlaceholder: {
    // SVG圖案會在這裡顯示
    width: 240,
    height: 240,
  },
});

export default Logo;
