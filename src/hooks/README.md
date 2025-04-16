# 📁 hooks

此資料夾用於集中管理 React Custom Hooks，封裝重複邏輯，提升程式碼重用性與可維護性。

---

## ✅ 命名原則

- 檔案皆使用 `useXXX.ts` 命名
- 檔案內必須使用 `export default function useXXX()` 輸出 Hook
- 若遇到跨平台差異，**優先以 `Platform.OS` 在同一檔案中判斷邏輯**（而非拆檔）

---

## 📦 現有 Hook 一覽

| Hook 名稱               | 功能說明                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `useCurrentLocation.ts` | 取得使用者目前位置，支援 Web / Native，並可取得錯誤訊息與設定引導 |

---

## 🧩 使用時機

可放在 hooks 資料夾的功能範例：

- 地理定位（如 `useCurrentLocation`）
- 資料同步處理（如 `useFetch`, `useDebounce`）
- 事件訂閱（如 `useScroll`, `useKeyboard`）
- 表單處理、倒數計時、複製剪貼簿等邏輯封裝

---

## 🛑 不建議放入的邏輯

- 全局共享狀態（請放入 `/context`）
- 視覺元件（請放入 `/components`）

---

如需建立複雜邏輯 hook，也請加註註解與範例，以利團隊維護。
