
const Colors = {
  // 圖示顏色
  icon: {
    default: '#000',
    primary: '#FF8C00',
    secondary: '#6495ED',
    disabled: '#ccc',
  },

  // Icon + 文字組合顏色
  iconText: {
    // 導航相關 (黑色圖示 + 黑色文字)
    navigation: {
      icon: '#000000',
      text: '#000000',
    },
    // 評分相關 (黃色星星 + 深灰文字)
    rating: {
      icon: '#FFD700',      // 黃色星星
      text: '#333333',      // 深灰評分數字
    },
    // 距離相關 (深灰圖示 + 深灰文字)
    distance: {
      icon: '#666666',      // 深灰定位圖釘
      text: '#666666',      // 深灰距離文字
    },
    // 讚相關 (淺藍圖示 + 深灰文字)
    thumbsUp: {
      icon: '#87CEEB',      // 淺藍色讚圖示
      text: '#333333',      // 深灰讚數文字
    },
    // 價格相關 (主題色圖示 + 主題色文字)
    price: {
      icon: '#FF8C00',      // 主題色圖示
      text: '#FF8C00',      // 主題色價格文字
    },
    // 狀態相關 (成功/錯誤/警告)
    status: {
      success: {
        icon: '#00aa00',
        text: '#00aa00',
      },
      error: {
        icon: '#ff4444',
        text: '#ff4444',
      },
      warning: {
        icon: '#ff8800',
        text: '#ff8800',
      },
    },
  },

  // 文字顏色
  text: {
    primary: '#333333',      // 主要文字（標題、重要內容）
    secondary: '#666666',    // 次要文字（描述、標籤）
    tertiary: '#999999',     // 第三級文字（輔助資訊）
    placeholder: '#cccccc',  // 佔位符文字
    disabled: '#cccccc',     // 禁用狀態文字
    white: '#ffffff',        // 白色文字
    error: '#ff4444',        // 錯誤文字
    success: '#00aa00',      // 成功文字
    warning: '#ff8800',      // 警告文字
    link: '#0066cc',         // 連結文字
  },

  // 輸入框顏色
  input: {
    placeholder: '#cccccc',
    background: '#ffffff',
    border: '#dddddd',
    focus: '#0066cc',
  },

  // 主題顏色
  primary: '#FF8C00',
  secondary: '#6495ED',

  // 背景顏色
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#f0f0f0',
  },
};

export default Colors;
