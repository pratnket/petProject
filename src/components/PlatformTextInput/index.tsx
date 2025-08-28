import {Platform} from 'react-native';

// 動態引入平台特定的組件
const TextInput = Platform.select({
  native: require('./PlatformTextInput.native').default,
  web: require('./PlatformTextInput.web').default,
});

export default TextInput;
