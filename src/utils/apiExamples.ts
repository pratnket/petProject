// 使用JWT Token的API調用示例
import { ApiClient } from './apiClient';
import { API_CONFIG } from '../constants/api';

// 示例：獲取會員資料
export const getMemberProfile = async () => {
  try {
    // 這個請求會自動帶上JWT token
    const response = await ApiClient.get('/api/member/profile');
    console.log('會員資料:', response);
    return response;
  } catch (error) {
    console.error('獲取會員資料失敗:', error);
    throw error;
  }
};

// 示例：更新會員資料
export const updateMemberProfile = async (profileData: {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
}) => {
  try {
    // 這個請求會自動帶上JWT token
    const response = await ApiClient.put('/api/member/update', profileData);
    console.log('更新成功:', response);
    return response;
  } catch (error) {
    console.error('更新會員資料失敗:', error);
    throw error;
  }
};

// 示例：會員登出
export const logoutMember = async () => {
  try {
    // 這個請求會自動帶上JWT token
    const response = await ApiClient.post('/api/logout');
    console.log('登出成功:', response);
    return response;
  } catch (error) {
    console.error('登出失敗:', error);
    throw error;
  }
};

// 示例：獲取會員列表（需要管理員權限）
export const getMemberList = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await ApiClient.get(`/api/admin/members${queryString}`);
    console.log('會員列表:', response);
    return response;
  } catch (error) {
    console.error('獲取會員列表失敗:', error);
    throw error;
  }
};
