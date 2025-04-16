
# 📦 components/shared

這個資料夾用來放置**半通用元件**或**多個模組共同使用但與畫面結構強相關的元件**。

- 元件可能包含與畫面耦合的邏輯（如 navigation, modal context）
- 僅被某一類畫面共用，不一定適合抽象化
- 可用於解耦重複出現的區塊，但不屬於「完全通用」元件

## 適合放這裡的元件範例：
- `Divider`
- `SectionHeader`
- `ListItem`（若不夠抽象）
- `ModalHeader`（若結構與 ModalContext 緊耦合）

> ℹ️ 若某元件後續越來越抽象建議遷移至 `common/`。
