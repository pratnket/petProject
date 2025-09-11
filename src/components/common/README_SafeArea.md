# 安全區域統一處理方案

## 概述

提供統一的組件來處理所有頁面的安全區域問題，避免重複代碼和遺漏。

## 組件說明

### 1. PageWrapper

用於一般頁面的安全區域包裝。

```tsx
import PageWrapper from '../components/common/PageWrapper';

const MyScreen = () => {
  return (
    <PageWrapper backgroundColor="#f5f5f5" statusBarStyle="dark-content">
      <View>{/* 頁面內容 */}</View>
    </PageWrapper>
  );
};
```

### 2. ModalWrapper

用於 Modal 的全螢幕安全區域包裝。

```tsx
import ModalWrapper from '../components/common/ModalWrapper';

const MyModal = () => {
  return (
    <ModalWrapper backgroundColor="#fff">
      <View>{/* Modal 內容 */}</View>
    </ModalWrapper>
  );
};
```

### 3. withSafeArea HOC

使用 HOC 模式自動包裝組件。

```tsx
import withSafeArea from '../components/common/withSafeArea';

const MyScreen = () => {
  return <View>{/* 頁面內容 */}</View>;
};

export default withSafeArea(MyScreen, {
  backgroundColor: '#f5f5f5',
  statusBarStyle: 'dark-content',
});
```

## 使用建議

### 一般頁面

使用 `PageWrapper` 包裝整個頁面內容。

### Modal 頁面

使用 `ModalWrapper` 包裝 Modal 內容。

### 需要自訂的頁面

使用 `withSafeArea` HOC 或直接使用 `SafeAreaWrapper`。

## 遷移指南

### 從現有 SafeAreaView 遷移

```tsx
// 舊寫法
<SafeAreaView style={styles.container} edges={['top', 'bottom']}>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />
  {/* 內容 */}
</SafeAreaView>

// 新寫法
<PageWrapper backgroundColor="#fff" statusBarStyle="dark-content">
  {/* 內容 */}
</PageWrapper>
```

### 從普通 View 遷移

```tsx
// 舊寫法
<View style={styles.container}>
  {/* 內容 */}
</View>

// 新寫法
<PageWrapper style={styles.container}>
  {/* 內容 */}
</PageWrapper>
```
