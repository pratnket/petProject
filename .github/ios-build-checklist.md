# 📱 iOS 構建檢查清單

## **🔑 必要配置項目**

### **1. Apple Developer 帳號**

- [ ] 有效的 Apple Developer 帳號
- [ ] 已創建 App ID
- [ ] 已創建 Provisioning Profile

### **2. iOS 專案配置**

- [ ] `ios/PetProject.xcodeproj` 存在
- [ ] `ios/PetProject.xcworkspace` 存在
- [ ] `ios/Podfile` 配置正確
- [ ] Bundle Identifier 設置正確

### **3. CocoaPods 依賴**

- [ ] 所有 iOS 依賴都已添加到 `Podfile`
- [ ] `pod install` 執行成功
- [ ] `.xcworkspace` 文件可用

### **4. 簽名和證書**

- [ ] 開發證書已安裝
- [ ] 分發證書已安裝
- [ ] Provisioning Profile 已配置

## **🚨 常見問題和解決方案**

### **問題 1：CocoaPods 安裝失敗**

```bash
# 解決方案
sudo gem install cocoapods
pod repo update
pod install --repo-update
```

### **問題 2：簽名錯誤**

```bash
# 在 Xcode 中檢查
# 1. Signing & Capabilities
# 2. Team 選擇
# 3. Bundle Identifier
```

### **問題 3：依賴缺失**

```bash
# 檢查 Podfile
# 確保所有必要的 pod 都已添加
```

## **🔧 GitHub Actions 配置**

### **自動觸發條件**

- [ ] 推送到 `master` 分支
- [ ] 推送到 `develop` 分支
- [ ] 創建 Pull Request

### **手動觸發**

- [ ] 前往 Actions 頁面
- [ ] 選擇 "iOS Advanced Build"
- [ ] 點擊 "Run workflow"

## **📋 構建前檢查**

1. **本地測試**：

   ```bash
   cd ios
   pod install
   xcodebuild -workspace PetProject.xcworkspace -scheme PetProject -configuration Debug
   ```

2. **依賴檢查**：

   ```bash
   yarn install
   yarn test
   ```

3. **提交代碼**：
   ```bash
   git add .
   git commit -m "準備 iOS 構建"
   git push origin master
   ```

## **🎯 成功指標**

- [ ] GitHub Actions 開始執行
- [ ] iOS 環境設置成功
- [ ] CocoaPods 依賴安裝成功
- [ ] Xcode 構建成功
- [ ] 構建產物上傳成功
- [ ] 測試通過

## **🆘 故障排除**

如果構建失敗，請檢查：

1. Actions 日誌中的錯誤信息
2. iOS 專案配置
3. CocoaPods 依賴
4. 簽名和證書配置
5. Xcode 版本兼容性
