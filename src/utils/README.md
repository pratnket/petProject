# 📁 utils

此資料夾用於放置**純函式工具（utility functions）**，專注處理資料格式、計算、轉換、請求等邏輯，**不涉及 React / UI 狀態管理**。

---

## ✅ 命名原則

- 每個工具模組為一個 `.ts` 檔案
- 若僅有單一函式，可 `export default`；多個工具請用具名匯出
- 工具名稱應語意清晰、與應用層分離（例如 `formatDate`, `reverseGeocode`, `validateEmail`）

---

## 📦 現有工具一覽

| 檔案名稱            | 功能說明                                              |
| ------------------- | ----------------------------------------------------- |
| `reverseGeocode.ts` | 使用 OpenStreetMap Nominatim API 進行座標反查城市名稱 |
| `getImageSource.ts` | 根據平台（Web / Native）自動切換圖片來源              |
| ...                 | 可根據需求新增格式化、驗證、數學等功能模組            |

---

## 🧩 適合放入的工具函式範例

- 時間 / 日期格式處理（`formatDate`, `parseDateRange`）
- 地理資訊處理（如 `reverseGeocode`, `distanceBetween`）
- 數字與文字轉換（如 `formatPrice`, `truncateText`）
- 驗證邏輯（如 `isValidEmail`, `isPhoneNumber`）
- 資料清理、排序、深拷貝等泛用邏輯

---

## 🛑 不建議放入此處的邏輯

| 類型             | 請改放的位置           |
| ---------------- | ---------------------- |
| React Hook       | `hooks/` 資料夾        |
| Context 狀態管理 | `context/` 資料夾      |
| UI 與呈現元件    | `components/` 資料夾   |
| 畫面頁面元件     | `screens/` 或 `pages/` |

---

> 📌 建議撰寫工具時加上適度註解與參考 API 說明（如有對外請求），提升日後維護與重用效率。
