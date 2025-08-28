// JWT Token 管理工具 - 使用 Keychain 安全存儲

const TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';

export interface UserInfo {
  id: string;
  account: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar?: string | null;
  status: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode?: string;
  message?: string;
  data: {
    user: UserInfo;
    token: string;
  };
  errors?: any[];
}

// 檢查 Keychain 是否可用
let keychainAvailable: boolean | null = null;

const checkKeychainAvailability = async (): Promise<boolean> => {
  if (keychainAvailable !== null) {
    return keychainAvailable;
  }

  try {
    console.log('🔍 開始檢查 Keychain 可用性...');

    // 動態引入 Keychain
    const Keychain = require('react-native-keychain');
    console.log('✅ Keychain 模組載入成功');

    // 檢查設備是否支持 Keychain
    try {
      console.log('🔍 檢查設備 Keychain 支持...');
      const supported = await Keychain.getSupportedBiometryType();
      console.log('📱 支持的生物識別類型:', supported);
    } catch (bioError) {
      console.warn('⚠️ 生物識別檢查失敗:', bioError.message);
    }

    // 嘗試設置一個測試值（使用新版本 API）
    console.log('🔍 測試 Keychain 基本功能...');
    try {
      await Keychain.setGenericPassword('test_key', 'test_value');
      console.log('✅ 測試存儲成功');

      // 嘗試讀取測試值（新版本 API）
      const testCredentials = await Keychain.getGenericPassword({ service: 'test_key' });
      console.log('✅ 測試讀取成功:', testCredentials ? '有數據' : '無數據');

      // 清理測試數據
      await Keychain.resetGenericPassword({ service: 'test_key' });
      console.log('✅ 測試清理成功');

      keychainAvailable = true;
      console.log('🔐 Keychain 完全可用，使用安全存儲');
      return true;
    } catch (testError) {
      console.error('❌ Keychain 功能測試失敗:', testError.message);
      throw testError;
    }

  } catch (error) {
    keychainAvailable = false;
    console.error('❌ Keychain 檢查失敗，詳細錯誤:', error);
    console.error('❌ 錯誤類型:', typeof error);
    console.error('❌ 錯誤名稱:', error.name);
    console.error('❌ 錯誤消息:', error.message);

    // 檢查是否是橋接問題
    if (error.message && error.message.includes('NOBRIDGE')) {
      console.error('🌉 檢測到橋接問題 - 原生模組未正確初始化');
      console.error('💡 建議：重新構建應用或檢查設備兼容性');
    }

    console.warn('⚠️ Keychain 不可用，回退到 AsyncStorage');
    return false;
  }
};

// 使用 Keychain 存儲認證數據
export const storeAuthData = async (authData: AuthResponse): Promise<void> => {
  try {
    const Keychain = require('react-native-keychain');
    await Keychain.setGenericPassword(TOKEN_KEY, authData.data.token, { service: TOKEN_KEY });
    await Keychain.setGenericPassword(USER_INFO_KEY, JSON.stringify(authData.data.user), { service: USER_INFO_KEY });
    console.log('🔐 認證數據已安全存儲到 Keychain/Keystore');
  } catch (error) {
    console.error('存儲認證數據失敗:', error);
    throw error;
  }
};

// 從 Keychain 獲取 token
export const getToken = async (): Promise<string | null> => {
  try {
    const Keychain = require('react-native-keychain');
    const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY });
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('獲取 token 失敗:', error);
    return null;
  }
};

// 從 Keychain 獲取用戶信息
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const Keychain = require('react-native-keychain');
    const credentials = await Keychain.getGenericPassword({ service: USER_INFO_KEY });
    if (credentials && credentials.password) {
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    console.error('獲取用戶信息失敗:', error);
    return null;
  }
};

// 清除 Keychain 中的認證數據
export const clearAuthData = async (): Promise<void> => {
  try {
    const Keychain = require('react-native-keychain');
    await Keychain.resetGenericPassword({ service: TOKEN_KEY });
    await Keychain.resetGenericPassword({ service: USER_INFO_KEY });
    console.log('🧹 已從 Keychain/Keystore 清除認證數據');
  } catch (error) {
    console.error('清除認證數據失敗:', error);
    throw error;
  }
};

// 檢查是否有有效的 token
export const hasValidToken = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// 獲取認證請求頭
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// 獲取當前存儲方式
export const getCurrentStorageMethod = async (): Promise<'keychain' | 'asyncstorage'> => {
  const useKeychain = await checkKeychainAvailability();
  return useKeychain ? 'keychain' : 'asyncstorage';
};

// 檢查生物識別是否可用
export const canUseBiometrics = async (): Promise<boolean> => {
  try {
    const useKeychain = await checkKeychainAvailability();
    if (!useKeychain) return false;

    const Keychain = require('react-native-keychain');
    return await Keychain.canImplyAuthentication({
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
    });
  } catch (error) {
    console.warn('檢查生物識別失敗:', error);
    return false;
  }
};
