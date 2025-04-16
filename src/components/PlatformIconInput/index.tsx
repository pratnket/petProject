import {Platform} from 'react-native';

// 動態引入平台特定的組件
const IconInput = Platform.select({
  native: require('./PlatformIconInput.native').default,
  web: require('./PlatformIconInput.web').default,
});

export default IconInput;
