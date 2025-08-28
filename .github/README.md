# 🚀 GitHub Actions 自動構建指南

## 📱 iOS 構建

### 自動觸發

- 推送到 `master` 或 `develop` 分支時自動構建
- 創建 Pull Request 時自動構建

### 手動觸發

1. 前往 GitHub 專案的 Actions 頁面
2. 選擇 "iOS Advanced Build" 工作流程
3. 點擊 "Run workflow"
4. 選擇構建類型（Debug 或 Release）
5. 點擊 "Run workflow"

### 構建環境

- **運行環境**: macOS 最新版本
- **Node.js**: 18.x
- **Ruby**: 3.0
- **CocoaPods**: 自動安裝

## 🤖 Android 構建

### 自動觸發

- 推送到 `master` 或 `develop` 分支時自動構建
- 創建 Pull Request 時自動構建

### 手動觸發

1. 前往 GitHub 專案的 Actions 頁面
2. 選擇 "Android Build" 工作流程
3. 點擊 "Run workflow"

### 構建環境

- **運行環境**: Ubuntu 最新版本
- **Node.js**: 18.x
- **Java**: 17 (Zulu)
- **Android SDK**: 34

## 📦 構建產物

### iOS 構建產物

- 位置: `ios/build/Build/Products/`
- 保留時間: 7 天
- 包含: Debug 和 Release 版本

### Android 構建產物

- 位置: `android/app/build/outputs/apk/release/`
- 保留時間: 7 天
- 包含: Release APK 文件

## 🔧 本地開發

### Windows 環境

```bash
# Android 構建
yarn android

# Web 版本
yarn web
```

### macOS 環境

```bash
# iOS 構建
yarn ios

# Android 構建
yarn android
```

## 📋 注意事項

1. **iOS 構建只能在 macOS 環境中執行**
2. **Android 構建可以在 Windows、macOS、Linux 環境中執行**
3. **構建產物會自動上傳到 GitHub Actions 的 Artifacts**
4. **每次構建都會執行測試**
5. **構建失敗時會發送通知**

## 🆘 故障排除

### 常見問題

1. **CocoaPods 安裝失敗**: 檢查 Ruby 版本
2. **Android SDK 問題**: 檢查 SDK 路徑和版本
3. **依賴安裝失敗**: 檢查 `yarn.lock` 文件

### 聯繫方式

如有問題，請檢查 Actions 日誌或聯繫開發團隊。
