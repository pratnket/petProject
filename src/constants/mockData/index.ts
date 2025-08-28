import { Platform } from 'react-native';

// 動態引入平台特定的組件
const mockData = Platform.select({
  native: require('./mockData.native').default,
  web: require('./mockData.web').default,
});

export default mockData;
