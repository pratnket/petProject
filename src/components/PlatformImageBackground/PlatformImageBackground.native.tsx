import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ImageSourcePropType,
} from 'react-native';

interface Props {
  source: ImageSourcePropType;
  children?: React.ReactNode;
}

const PlatformImageBackground: React.FC<Props> = ({source, children}) => {
  return (
    <ImageBackground source={source} style={styles.background}>
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 150, // 可以調整高度
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default PlatformImageBackground;
