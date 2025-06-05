import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainNavigator from './navigation/MainNavigator';
import Providers from './providers/Providers';
import OnboardingScreen from './screens/OnboardingScreen'; // ← 你自訂的歡迎頁

const App = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      // 網頁版跳過 onboarding
      setHasSeenOnboarding(true);
      return;
    }

    const checkFirstLaunch = async () => {
      const flag = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(flag === 'true');
    };
    checkFirstLaunch();
  }, []);

  if (hasSeenOnboarding === null) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <Providers>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          {hasSeenOnboarding ? (
            <MainNavigator />
          ) : (
            <OnboardingScreen
              onFinish={async () => {
                await AsyncStorage.setItem('hasSeenOnboarding', 'false');
                setHasSeenOnboarding(true);
              }}
            />
          )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
