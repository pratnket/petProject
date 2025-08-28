# 環境配置說明

## 概述

這個項目支援多環境配置，可以輕鬆切換開發、測試和生產環境的 API 設定。

## 環境配置

### 1. 開發環境 (Development)

- **API 基礎 URL**: `http://35.185.134.254`
- **調試模式**: 開啟
- **日誌級別**: debug
- **超時時間**: 10 秒

### 2. 測試環境 (Staging)

- **API 基礎 URL**: `http://staging-api.example.com`
- **調試模式**: 開啟
- **日誌級別**: info
- **超時時間**: 15 秒

### 3. 生產環境 (Production)

- **API 基礎 URL**: `https://api.example.com`
- **調試模式**: 關閉
- **日誌級別**: error
- **超時時間**: 20 秒

## 環境變數配置

創建 `.env` 文件來覆蓋默認配置：

```bash
# .env 文件
REACT_APP_API_BASE_URL=http://your-dev-api.com
REACT_APP_API_TIMEOUT=15000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

## 使用方法

### 在組件中使用

```typescript
import {API_CONFIG, buildApiUrl} from '../constants/api';
import {isDevelopment, getCurrentEnv} from '../constants/env';

// 獲取API URL
const loginUrl = buildApiUrl(API_CONFIG.ENDPOINTS.MEMBER_LOGIN);

// 檢查環境
if (isDevelopment()) {
  console.log('當前是開發環境');
}

// 獲取當前環境
const currentEnv = getCurrentEnv();
```

### 環境檢查函數

```typescript
import {
  isDevelopment,
  isStaging,
  isProduction,
  getCurrentEnvConfig,
} from '../constants/env';

// 環境檢查
if (isDevelopment()) {
  // 開發環境特定邏輯
}

// 獲取當前環境配置
const config = getCurrentEnvConfig();
console.log('API URL:', config.API_BASE_URL);
```

## 自動環境檢測

系統會自動檢測 `NODE_ENV` 環境變數：

- `NODE_ENV=development` → 開發環境
- `NODE_ENV=staging` → 測試環境
- `NODE_ENV=production` → 生產環境

## 開發環境調試

在開發環境下，控制台會顯示：

```
🌍 當前環境: development
🔧 環境配置: { API_BASE_URL: "http://35.185.134.254", ... }
🔧 開發環境配置: { BASE_URL: "http://35.185.134.254", ... }
```

## 注意事項

1. **環境變數必須以 `REACT_APP_` 開頭**
2. **修改環境變數後需要重啟開發服務器**
3. **生產環境會自動關閉調試功能**
4. **API 端點路徑在所有環境中保持一致**

## 未來擴展

- [ ] 支援更多環境變數
- [ ] 添加環境特定的功能開關
- [ ] 支援動態環境切換
- [ ] 添加環境配置驗證
