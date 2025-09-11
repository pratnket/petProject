import React, {useEffect} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './navigation/MainNavigator';
import Providers from './providers/Providers';

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // 網頁版跳過歡迎Modal
      return;
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Providers>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </Providers>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
