import {Platform} from 'react-native';

// 動態引入平台特定的組件
const ModalWrapper = Platform.select({
  native: require('./ModalWrapper.native').default,
  web: require('./ModalWrapper.web').default,
});

export default ModalWrapper;
