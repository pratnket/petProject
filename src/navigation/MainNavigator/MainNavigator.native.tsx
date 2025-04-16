import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 頁面
import HomeScreen from '../../screens/HomeScreen';
import HeartScreen from '../../screens/HeartScreen';
import MemberScreen from '../../screens/MemberScreen';

// 搜索頁
import SearchScreen from '../../screens/SearchScreen';

// 使用 AuthContext
import {useAuth} from '../../context/AuthContext';

// 創建 Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// ✅ 把 tabBarIcon 抽出來
const getTabBarIcon =
  (routeName: string) =>
  ({focused, color, size}: {focused: boolean; color: string; size: number}) => {
    let iconName = '';

    if (routeName === 'Home') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (routeName === 'Heart') {
      iconName = focused ? 'heart' : 'heart-outline';
    } else if (routeName === 'Member') {
      iconName = focused ? 'person' : 'person-outline'; // ✅ 加這行
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

// **底部 Tab 導航**
const TabNavigator = () => {
  const {isSignedIn} = useAuth(); // 使用 useAuth 來取得登入狀態

  return (
    <Tab.Navigator
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
};

const Stack = createStackNavigator<RootStackParamList>();

// **主導航器**
const MainNavigator = () => {
  return (
    <Stack.Navigator
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
    </Stack.Navigator>
  );
};

export default MainNavigator;
