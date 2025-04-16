import { Platform } from 'react-native';

// 動態引入平台特定的組件
const ImageAssets = Platform.select({
  native: require('./ImageAssets.native').default,
  web: require('./ImageAssets.web').default,
});

export default ImageAssets;
