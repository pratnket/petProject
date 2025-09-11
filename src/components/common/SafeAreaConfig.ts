/**
 * 安全區域統一配置
 * 定義所有頁面的安全區域設定
 */

export interface SafeAreaConfig {
  backgroundColor: string;
  statusBarStyle: 'default' | 'light-content' | 'dark-content';
  edges: ('top' | 'bottom' | 'left' | 'right')[];
  showStatusBar: boolean;
  headerPadding: {
    top: number;
    bottom: number;
    horizontal: number;
  };
}

// 預設配置
export const DEFAULT_SAFE_AREA_CONFIG: SafeAreaConfig = {
  backgroundColor: '#fff',
  statusBarStyle: 'dark-content',
  edges: ['top', 'bottom'],
  showStatusBar: true,
  headerPadding: {
    top: 24,
    bottom: 12,
    horizontal: 0,
  },
};

// 頁面特定配置
export const PAGE_CONFIGS = {
  // 一般頁面
  default: DEFAULT_SAFE_AREA_CONFIG,

  // 搜尋頁面
  search: {
    ...DEFAULT_SAFE_AREA_CONFIG,
    backgroundColor: '#f0f8ff', // 淺藍色背景來驗證安全區域
    headerPadding: {
      top: 20,
      bottom: 8,
      horizontal: 0,
    },
  },

  // 預訂頁面
  booking: {
    ...DEFAULT_SAFE_AREA_CONFIG,
    backgroundColor: '#f5f5dc', // 米色背景來驗證安全區域
    headerPadding: {
      top: 20,
      bottom: 16,
      horizontal: 0,
    },
  },

  // 會員頁面
  member: {
    ...DEFAULT_SAFE_AREA_CONFIG,
    backgroundColor: '#F7F2EF',
    statusBarStyle: 'dark-content',
    headerPadding: {
      top: 16,
      bottom: 8,
      horizontal: 0,
    },
  },

  // Modal 頁面
  modal: {
    ...DEFAULT_SAFE_AREA_CONFIG,
    edges: ['top', 'bottom'],
    headerPadding: {
      top: 16,
      bottom: 8,
      horizontal: 16,
    },
  },

  // 日期選擇 Modal
  dateModal: {
    ...DEFAULT_SAFE_AREA_CONFIG,
    backgroundColor: '#9ec7ff',
    statusBarStyle: 'dark-content',
    headerPadding: {
      top: 24,
      bottom: 12,
      horizontal: 16,
    },
  },
} as const;

export type PageType = keyof typeof PAGE_CONFIGS;
