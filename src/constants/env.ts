// 環境配置文件
// 可以通過環境變數或本地配置來覆蓋

export const ENV_CONFIG = {
  // 開發環境 (Development)
  development: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://35.185.134.254',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    DEBUG: process.env.REACT_APP_DEBUG !== 'false',
    LOG_LEVEL: 'debug',
  },

  // 測試環境 (Staging/Testing)
  staging: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://staging-api.example.com',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '15000'),
    DEBUG: process.env.REACT_APP_DEBUG !== 'false',
    LOG_LEVEL: 'info',
  },

  // 生產環境 (Production)
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '20000'),
    DEBUG: false,
    LOG_LEVEL: 'error',
  },
};

// 獲取當前環境
export const getCurrentEnv = (): string => {
  // 檢查多種環境變數來源
  const env = process.env.NODE_ENV ||
    process.env.REACT_APP_NODE_ENV ||
    'development';

  // 確保返回有效的環境值
  if (['development', 'staging', 'production'].includes(env)) {
    return env;
  }

  // 默認返回開發環境
  return 'development';
};

// 獲取當前環境配置
export const getCurrentEnvConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};

// 環境檢查函數
export const isDevelopment = () => getCurrentEnv() === 'development';
export const isStaging = () => getCurrentEnv() === 'staging';
export const isProduction = () => getCurrentEnv() === 'production';

// 開發環境下的調試信息
if (isDevelopment()) {
  console.log('🌍 當前環境:', getCurrentEnv());
  console.log('🔧 環境配置:', getCurrentEnvConfig());
  console.log('🔍 環境變數檢查:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_NODE_ENV: process.env.REACT_APP_NODE_ENV,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL
  });
}
