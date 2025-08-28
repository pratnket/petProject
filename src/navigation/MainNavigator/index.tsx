import {Platform} from 'react-native';

// 動態引入平台特定的組件
const navigation = Platform.select({
  native: require('./MainNavigator.native').default,
  web: require('./MainNavigator.web').default,
});

// 創建 Stack Navigator
export type RootStackParamList = {
  Main: undefined;
  Search: {keyword: string};
  Auth: {defaultTab?: 'login' | 'register'};
};

export default navigation;
