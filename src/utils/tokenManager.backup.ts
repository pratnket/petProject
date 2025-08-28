// JWT Token 管理工具 - 備份文件 (AsyncStorage 版本)
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 存儲 token 和用戶信息
export const storeAuthData = async (authData: AuthResponse): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, authData.data.token],
      [USER_INFO_KEY, JSON.stringify(authData.data.user)],
    ]);
  } catch (error) {
    console.error('存儲認證數據失敗:', error);
    throw error;
  }
};

// 獲取 token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('獲取 token 失敗:', error);
    return null;
  }
};

// 獲取用戶信息
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfoStr = await AsyncStorage.getItem(USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error('獲取用戶信息失敗:', error);
    return null;
  }
};

// 清除認證數據
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_INFO_KEY]);
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
