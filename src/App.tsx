import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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
    <Providers>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <MainNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Providers>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
