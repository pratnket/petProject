import {Platform} from 'react-native';

// 動態引入平台特定的組件
const PlatformHotelList = Platform.select({
  native: require('./PlatformHotelList.native').default,
  web: require('./PlatformHotelList.web').default,
});

export default PlatformHotelList;
