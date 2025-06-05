import { Platform } from 'react-native';

// 動態引入平台特定的組件
const useCurrentLocation = Platform.select({
  native: require('./useCurrentLocation.native').default,
  web: require('./useCurrentLocation.web').default,
});

export default useCurrentLocation;
