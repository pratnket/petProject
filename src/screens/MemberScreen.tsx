import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigator';
import {ApiClient} from '../utils/apiClient';
import {clearAuthData} from '../utils/tokenManager';
import AuthButton from '../components/common/AuthButton';
import Logo from '../components/common/Logo';

type MemberScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Auth'
>;

const MemberScreen = () => {
  const {isSignedIn, signOut} = useAuth();
  const navigation = useNavigation<MemberScreenNavigationProp>();

  const handleSignOut = async () => {
    try {
      console.log('🚪 開始登出...');

      // 調用登出API
      const result = await ApiClient.post('/api/logout');
      console.log('📡 登出API響應:', result);
      console.log('✅ 登出成功');
    } catch (error) {
      console.error('❌ 登出API調用失敗:', error);
      console.log('⚠️ 即使API調用失敗，也會清除本地數據');
      // 即使API調用失敗，也要清除本地數據
    } finally {
      console.log('🧹 清除本地認證數據...');
      // 清除本地認證數據
      await clearAuthData();
      console.log('🔄 更新應用狀態...');
      signOut();
      console.log('👋 登出完成');
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Auth', {defaultTab: 'login'});
  };

  const handleGoToRegister = () => {
    navigation.navigate('Auth', {defaultTab: 'register'});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F2EF" />

      {isSignedIn ? (
        // 已登入狀態 - 會員中心
        <ScrollView
          style={styles.memberContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Logo 區域 */}
          <View style={styles.logoSection}>
            <Logo />
          </View>

          {/* 歡迎標題 */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>歡迎來到會員中心</Text>
            <Text style={styles.subTitle}>管理您的帳戶和偏好設定</Text>
          </View>

          {/* 會員功能選單 */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>個人資料</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>訂單記錄</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>收藏清單</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>通知設定</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>隱私設定</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 登出按鈕 */}
          <View style={styles.logoutSection}>
            <AuthButton
              title="登出"
              onPress={handleSignOut}
              variant="outline"
              style={styles.logoutButton}
            />
          </View>
        </ScrollView>
      ) : (
        // 未登入狀態 - 引導到登入頁面
        <ScrollView
          style={styles.guestContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Logo 區域 */}
          <View style={styles.logoSection}>
            <Logo />
          </View>

          {/* 引導標題 */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>歡迎使用寵物旅館</Text>
            <Text style={styles.subTitle}>請登入或註冊以使用完整功能</Text>
          </View>

          {/* 登入/註冊按鈕 */}
          <View style={styles.authSection}>
            <AuthButton
              title="登入"
              onPress={handleGoToLogin}
              variant="outline"
              style={styles.authButton}
            />

            <AuthButton
              title="註冊"
              onPress={handleGoToRegister}
              variant="filled"
              style={styles.authButton}
            />
          </View>

          {/* 功能說明 */}
          <View style={styles.featureSection}>
            <Text style={styles.featureTitle}>會員專享功能：</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>快速預訂寵物旅館</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>查看訂單記錄</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>收藏喜愛的旅館</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureDot}>•</Text>
              <Text style={styles.featureText}>個人化推薦</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F2EF', // 淺米色背景
  },
  memberContainer: {
    flex: 1,
  },
  guestContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#888',
  },
  logoutSection: {
    marginTop: 20,
  },
  logoutButton: {
    marginBottom: 16,
  },
  authSection: {
    marginTop: 20,
  },
  authButton: {
    marginBottom: 16,
  },
  featureSection: {
    marginTop: 30,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureDot: {
    fontSize: 20,
    marginRight: 10,
    color: '#8B4513',
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
});

export default MemberScreen;
