import { getCurrentEnvConfig } from './env';

// API 配置
export const API_CONFIG = {
  // 從環境配置獲取
  BASE_URL: getCurrentEnvConfig().API_BASE_URL,
  API_TIMEOUT: getCurrentEnvConfig().API_TIMEOUT,
  DEBUG: getCurrentEnvConfig().DEBUG,

  // API端點
  ENDPOINTS: {
    // 驗證相關
    SEND_VERIFICATION_EMAIL: '/api/public/verify/emails/send',

    // 會員相關
    MEMBER_REGISTRATION: '/api/public/members',
    MEMBER_LOGIN: '/api/login',
    MEMBER_LOGOUT: '/api/logout',

    // 需要認證的端點
    MEMBER_PROFILE: '/api/member/profile',
    MEMBER_UPDATE: '/api/member/update',
  },

  // 通用配置
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// 構建完整的API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};


