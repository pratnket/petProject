import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import Providers from './providers/Providers'; // 引入 Providers 組件

const App = () => {
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
