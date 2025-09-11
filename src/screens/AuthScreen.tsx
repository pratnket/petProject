import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import PageWrapper from '../components/safe-area/PageWrapper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/MainNavigator';
import {ApiClient} from '../utils/apiClient';
import {storeAuthData, AuthResponse} from '../utils/tokenManager';
import {useAuth} from '../context/AuthContext';
import AuthButton from '../components/common/AuthButton';
import AuthInput from '../components/common/AuthInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;
type AuthScreenRouteProp = RouteProp<RootStackParamList, 'Auth'>;

type TabType = 'login' | 'register';

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute<AuthScreenRouteProp>();
  const {signIn} = useAuth();

  // 從路由參數獲取預設選項卡，如果沒有則預設為登入
  const defaultTab: TabType = (route.params as any)?.defaultTab || 'login';
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  // 當路由參數改變時更新選項卡
  useEffect(() => {
    if ((route.params as any)?.defaultTab) {
      setActiveTab((route.params as any).defaultTab);
    }
  }, [route.params]);

  // 登入狀態
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 註冊狀態
  const [registerName, setRegisterName] = useState('');
  const [registerAccount, setRegisterAccount] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 切換選項卡
  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    // 清空表單數據
    if (tab === 'login') {
      setRegisterName('');
      setRegisterAccount('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterEmail('');
      setRegisterPhone('');
      setVerificationCode('');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // 發送驗證碼
  const sendVerificationCode = async () => {
    if (!registerEmail.trim()) {
      Alert.alert('錯誤', '請先輸入電子郵件');
      return;
    }

    try {
      const result = await ApiClient.publicRequest(
        '/api/public/verify/emails/send',
        {
          method: 'POST',
          body: JSON.stringify({
            email: registerEmail.trim(),
          }),
        },
      );

      if (result && (result as any).success) {
        Alert.alert('成功', '驗證碼已發送到您的郵箱');
        // 開始倒計時
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert('錯誤', (result as any)?.message || '發送驗證碼失敗');
      }
    } catch (error) {
      console.error('發送驗證碼錯誤:', error);
      Alert.alert('錯誤', '發送驗證碼失敗，請稍後再試');
    }
  };

  // 登入處理
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('錯誤', '請輸入電子郵件和密碼');
      return;
    }

    try {
      console.log('🔐 開始登入...');
      console.log('📧 登入郵箱:', loginEmail);
      console.log('🔑 登入密碼:', loginPassword ? '***' : '未輸入');

      const result = await ApiClient.publicRequest<AuthResponse>('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      console.log('📡 API響應:', result);

      if (result && (result as any).success) {
        await storeAuthData(result);

        console.log('✅ 登入成功!');
        console.log('👤 用戶信息:', result.data.user);
        console.log('🔑 Token:', result.data.token);

        signIn();

        // 設置用戶已經看過歡迎Modal，避免重複顯示
        try {
          await AsyncStorage.setItem('hasSeenWelcome', 'true');
          console.log('💾 已設置 hasSeenWelcome 為 true');
        } catch (error) {
          console.error('設置 hasSeenWelcome 失敗:', error);
        }

        // 顯示成功訊息並導航
        Alert.alert('成功', '登入成功！', [
          {
            text: '確定',
            onPress: () => {
              console.log('🚀 開始導航到主頁面...');
              // 直接導航到主頁面，不使用 goBack
              navigation.reset({
                index: 0,
                routes: [{name: 'Main'}],
              });
            },
          },
        ]);
      } else {
        Alert.alert('錯誤', result.message || '登入失敗');
        console.log('❌ 登入失敗:', result.message);
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      Alert.alert('錯誤', '登入失敗，請稍後再試');
    }
  };

  // 註冊處理
  const handleRegister = async () => {
    // 驗證必填欄位
    if (
      !registerName.trim() ||
      !registerAccount.trim() ||
      !registerPassword ||
      !registerConfirmPassword ||
      !registerEmail.trim() ||
      !registerPhone.trim() ||
      !verificationCode.trim()
    ) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    // 驗證密碼
    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('錯誤', '兩次輸入的密碼不一致');
      return;
    }

    if (registerPassword.length < 6) {
      Alert.alert('錯誤', '密碼長度至少需要6位');
      return;
    }

    try {
      console.log('📝 開始註冊...');
      console.log('👤 姓名:', registerName);
      console.log('📱 帳號:', registerAccount);
      console.log('📧 郵箱:', registerEmail);
      console.log('📞 電話:', registerPhone);

      const result = await ApiClient.publicRequest('/api/public/members', {
        method: 'POST',
        body: JSON.stringify({
          name: registerName.trim(),
          account: registerAccount.trim(),
          password: registerPassword,
          email: registerEmail.trim(),
          phoneNumber: registerPhone.trim(),
          verificationCode: verificationCode.trim(),
        }),
      });

      console.log('📡 API響應:', result);

      if (result && (result as any).success) {
        Alert.alert('成功', '註冊成功！請使用新帳號登入');
        console.log('✅ 註冊成功!');

        // 切換到登入選項卡
        switchTab('login');
        // 清空註冊表單
        setRegisterName('');
        setRegisterAccount('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setRegisterEmail('');
        setRegisterPhone('');
        setVerificationCode('');
      } else {
        Alert.alert('錯誤', (result as any)?.message || '註冊失敗');
        console.log('❌ 註冊失敗:', (result as any)?.message);
      }
    } catch (error) {
      console.error('註冊錯誤:', error);
      Alert.alert('錯誤', '註冊失敗，請稍後再試');
    }
  };

  return (
    <PageWrapper style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 頂部標題 */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>登入與註冊</Text>
        </View>

        {/* 選項卡切換 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => switchTab('login')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText,
              ]}>
              登入
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'register' && styles.activeTab]}
            onPress={() => switchTab('register')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'register' && styles.activeTabText,
              ]}>
              註冊
            </Text>
          </TouchableOpacity>
        </View>

        {/* 登入表單 */}
        {activeTab === 'login' && (
          <View style={styles.formSection}>
            <AuthInput
              label="Email"
              placeholder="請輸入您的電子郵件"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <AuthInput
              label="密碼"
              placeholder="請輸入您的密碼"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
              required
            />

            {/* 登入按鈕 */}
            <AuthButton
              title="登入"
              onPress={handleLogin}
              variant="filled"
              style={styles.loginButton}
            />

            {/* 忘記密碼連結 */}
            <TouchableOpacity style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>忘記帳號密碼？</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 註冊表單 */}
        {activeTab === 'register' && (
          <View style={styles.formSection}>
            <AuthInput
              label="姓名"
              placeholder="請輸入您的姓名"
              value={registerName}
              onChangeText={setRegisterName}
              required
            />

            <AuthInput
              label="帳號"
              placeholder="請輸入您的帳號"
              value={registerAccount}
              onChangeText={setRegisterAccount}
              autoCapitalize="none"
              required
            />

            <AuthInput
              label="密碼"
              placeholder="請輸入您的密碼"
              value={registerPassword}
              onChangeText={setRegisterPassword}
              secureTextEntry
              required
            />

            <AuthInput
              label="確認密碼"
              placeholder="請再次輸入密碼"
              value={registerConfirmPassword}
              onChangeText={setRegisterConfirmPassword}
              secureTextEntry
              required
            />

            <AuthInput
              label="電子郵件"
              placeholder="請輸入您的電子郵件"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <AuthInput
              label="電話號碼"
              placeholder="請輸入您的電話號碼"
              value={registerPhone}
              onChangeText={setRegisterPhone}
              keyboardType="phone-pad"
              required
            />

            {/* 驗證碼區域 */}
            <View style={styles.verificationSection}>
              <AuthInput
                label="驗證碼"
                placeholder="請輸入驗證碼"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                required
                containerStyle={styles.verificationInput}
              />

              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  countdown > 0 && styles.sendCodeButtonDisabled,
                ]}
                onPress={sendVerificationCode}
                disabled={countdown > 0}>
                <Text style={styles.sendCodeButtonText}>
                  {countdown > 0 ? `${countdown}s` : '發送驗證碼'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 註冊按鈕 */}
            <AuthButton
              title="註冊"
              onPress={handleRegister}
              variant="filled"
              style={styles.registerButton}
            />
          </View>
        )}
      </ScrollView>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#A67458',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formSection: {
    paddingTop: 20,
  },
  loginButton: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 16,
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  verificationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 12,
  },
  sendCodeButton: {
    backgroundColor: '#A67458',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendCodeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
});

export default AuthScreen;
