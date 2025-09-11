import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useModal} from '../context/ModalContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';
import AuthButton from '../components/common/AuthButton';
import Logo from '../components/common/Logo';

type WelcomeModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Auth'
>;

const WelcomeModal = () => {
  const {closeModal, activeModal} = useModal();
  const navigation = useNavigation<WelcomeModalNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 檢查是否應該顯示歡迎Modal
  if (activeModal !== 'welcome') {
    return null;
  }

  // 🎨 優雅的關閉動畫
  const animateClose = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
    });
  };

  const handleClose = async () => {
    // 記錄用戶已經看過歡迎Modal
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      console.log('💾 已保存歡迎Modal狀態');
    } catch (error) {
      console.error('保存歡迎Modal狀態失敗:', error);
    }
    closeModal();
  };

  const handleLogin = () => {
    // 🎭 優雅的關閉動畫後導航
    animateClose(() => {
      closeModal();
      setTimeout(() => {
        navigation.navigate('Auth', {defaultTab: 'login'});
      }, 100);
    });
  };

  const handleRegister = () => {
    // 🎭 優雅的關閉動畫後導航
    animateClose(() => {
      closeModal();
      setTimeout(() => {
        navigation.navigate('Auth', {defaultTab: 'register'});
      }, 100);
    });
  };

  console.log('🎭 WelcomeModal 渲染');

  return (
    <View style={styles.fullScreenOverlay}>
      <Animated.View
        style={[
          styles.fullScreenContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* 關閉按鈕 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          disabled={false}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* 頂部標題 */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>歡迎來到 PawPad</Text>
            <Text style={styles.subTitle}>毛孩的假期從這裡開始！</Text>
          </View>

          {/* Logo區域 */}
          <View style={styles.logoSection}>
            <Logo size={180} />
          </View>

          {/* 按鈕區域 */}
          <View style={styles.buttonSection}>
            {/* 登入按鈕 */}
            <AuthButton
              title="登入"
              onPress={handleLogin}
              variant="outline"
              style={styles.loginButton}
              disabled={false}
            />

            {/* 註冊按鈕 */}
            <AuthButton
              title="註冊"
              onPress={handleRegister}
              variant="filled"
              style={styles.registerButton}
              disabled={false}
            />

            {/* 忘記密碼連結 */}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              disabled={false}>
              <Text style={styles.forgotPasswordText}>忘記帳號密碼？</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Loading 遮罩 */}
        {false && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              {/* <ActivityIndicator size="large" color="#A67458" /> */}
              <Text style={styles.loadingText}>載入中...</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F5DC',
    zIndex: 99999, // 提高 zIndex 確保在最上層
    elevation: 99999, // Android 的 elevation
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonSection: {
    paddingTop: 20,
  },
  loginButton: {
    marginBottom: 16,
  },
  registerButton: {
    marginBottom: 24,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8B4513',
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
});

export default WelcomeModal;
