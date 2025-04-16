import {Platform} from 'react-native';

// 動態引入平台特定的組件
const PlatformImageBackground = Platform.select({
  native: require('./PlatformImageBackground.native').default,
  web: require('./PlatformImageBackground.web').default,
});

export default PlatformImageBackground;
