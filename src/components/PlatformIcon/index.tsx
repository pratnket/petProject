import {Platform} from 'react-native';

// 動態引入平台特定的組件
const Icon = Platform.select({
  native: require('./Icon.native').default,
  web: require('./Icon.web').default,
});

export default Icon;
