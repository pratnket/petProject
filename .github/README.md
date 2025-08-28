# GitHub Actions 自動構建說明

## 🚀 功能概述

本專案使用 GitHub Actions 自動化構建流程，支援：

- **iOS 構建**：在 macOS 環境中自動構建 iOS 應用程式
- **Android 構建**：在 Windows 環境中自動構建 Android 應用程式
- **自動測試**：執行測試和程式碼檢查
- **構建成品上傳**：自動上傳構建結果供下載

## 📁 工作流程檔案

### 1. iOS 構建 (`ios-build.yml`)

- **觸發條件**：推送到 main/develop 分支、PR、手動觸發
- **執行環境**：macOS latest
- **構建類型**：Release 版本
- **輸出**：`.xcarchive` 檔案

### 2. iOS 進階構建 (`ios-advanced.yml`)

- **觸發條件**：同上，支援手動選擇構建類型
- **執行環境**：macOS latest
- **構建類型**：Debug/Release 可選
- **測試**：先執行測試，通過後才構建

### 3. Android 構建 (`android-build.yml`)

- **觸發條件**：推送到 main/develop 分支、PR、手動觸發
- **執行環境**：Windows latest
- **構建類型**：Debug 和 Release 版本
- **輸出**：`.apk` 檔案

## 🔧 使用方法

### 自動觸發

1. 推送程式碼到 `main` 或 `develop` 分支
2. 創建 Pull Request
3. GitHub Actions 會自動執行

### 手動觸發

1. 前往 GitHub 專案的 Actions 頁面
2. 選擇想要執行的工作流程
3. 點擊 "Run workflow"
4. 選擇分支和參數（如適用）
5. 點擊 "Run workflow"

## 📱 構建成品

### iOS 構建成品

- 位置：Actions → 工作流程 → Artifacts
- 檔案：`ios-build` 或 `ios-debug-build`/`ios-release-build`
- 格式：`.xcarchive`
- 保留時間：7 天

### Android 構建成品

- 位置：Actions → 工作流程 → Artifacts
- 檔案：`android-debug-apk` 和 `android-release-apk`
- 格式：`.apk`
- 保留時間：7 天

## 🛠️ 故障排除

### 常見問題

1. **iOS 構建失敗**

   - 檢查 Podfile 是否正確
   - 確認 Xcode 專案配置
   - 查看 Actions 日誌中的錯誤訊息

2. **Android 構建失敗**

   - 檢查 Gradle 配置
   - 確認 Android SDK 版本
   - 查看 Actions 日誌中的錯誤訊息

3. **依賴安裝失敗**
   - 檢查 `package.json` 和 `yarn.lock`
   - 確認 Node.js 版本相容性

### 日誌查看

1. 前往 Actions 頁面
2. 點擊失敗的工作流程
3. 點擊失敗的 job
4. 查看詳細的執行日誌

## 🔄 自定義配置

### 修改觸發條件

編輯工作流程檔案中的 `on` 部分：

```yaml
on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # 每週日執行
```

### 修改構建參數

編輯工作流程檔案中的環境變數：

```yaml
env:
  NODE_VERSION: '18'
  RUBY_VERSION: '3.0'
  BUILD_TYPE: 'release'
```

## 📞 支援

如有問題，請：

1. 檢查 GitHub Actions 日誌
2. 查看本說明文件
3. 創建 Issue 描述問題
