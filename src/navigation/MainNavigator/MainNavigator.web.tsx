import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FaHome, FaHeart, FaUser} from 'react-icons/fa'; // 使用 react-icons

// 頁面
import HomeScreen from '../../screens/HomeScreen';
import HeartScreen from '../../screens/HeartScreen';
import MemberScreen from '../../screens/MemberScreen';
import AuthScreen from '../../screens/AuthScreen';

// 搜索頁
import SearchScreen from '../../screens/SearchScreen';

// 旅館詳細頁
import HotelDetailScreen from '../../screens/HotelDetailScreen';

// 選擇方案詳細頁
import BookingScreen from '../../screens/BookingScreen';

// 使用 AuthContext
import {useAuth} from '../../context/AuthContext';

// 創建 Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// ✅ 把 tabBarIcon 抽出來
const getTabBarIcon =
  (routeName: string) =>
  ({
    _focused,
    color,
    size,
  }: {
    _focused: boolean;
    color: string;
    size: number;
  }) => {
    let icon = null;

    if (routeName === 'Home') {
      icon = <FaHome size={size} color={color} />;
    } else if (routeName === 'Heart') {
      icon = <FaHeart size={size} color={color} />;
    } else if (routeName === 'Member') {
      icon = <FaUser size={size} color={color} />;
    }

    return icon;
  };

// **底部 Tab 導航**
const TabNavigator = () => {
  const {isSignedIn} = useAuth(); // 使用 useAuth 來取得登入狀態

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: getTabBarIcon(route.name), // 這樣就沒問題了
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Heart" component={HeartScreen} />
      <Tab.Screen
        name="Member"
        component={MemberScreen}
        options={{
          title: isSignedIn ? '會員中心' : '登入', // 根據登入狀態顯示標題
        }}
      />
    </Tab.Navigator>
  );
};

// 創建 Stack Navigator
export type RootStackParamList = {
  Main: undefined;
  Search: {keyword: string};
  HotelDetailScreen: {hotel: any; plans: any[]};
  BookingScreen: {hotel: any; plan: any; selectedSlot?: any};
  NearbyMapScreen: undefined;
  BookingFormScreen: {hotel: any; plan: any; selectedSlot: any};
  Auth: {defaultTab?: 'login' | 'register'};
};

const Stack = createStackNavigator<RootStackParamList>();

// **主導航器**
const MainNavigator = () => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {backgroundColor: '#6200ee'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      {/* 這裡用 TabNavigator 作為主要畫面 */}
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HotelDetailScreen"
        component={HotelDetailScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // 禁用滑動返回手勢
        }}
      />
      <Stack.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // 禁用滑動返回手勢
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          title: '登入與註冊',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
            height: 42,
          },
          headerTitleStyle: {
            fontFamily: 'Noto Sans TC',
            fontWeight: '700',
            fontSize: 16,
            textAlign: 'center',
          },
          headerTintColor: '#000000',
          // 🎨 Web 版本動畫優化
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 400,
                easing: require('react-native').Easing.bezier(0.4, 0.0, 0.2, 1),
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 300,
                easing: require('react-native').Easing.bezier(0.4, 0.0, 0.2, 1),
              },
            },
          },
          // 🎭 Web 版本過渡效果
          cardStyleInterpolator: ({current}) => {
            return {
              cardStyle: {
                transform: [
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            };
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
